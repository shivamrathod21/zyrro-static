#!/bin/bash

# Script for deploying the Zyro application on AWS EC2
# Usage: ./deploy-ec2.sh

# Exit on error
set -e

echo "====== Starting Zyro Deployment ======"

# Update system packages
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install dependencies
echo "Installing dependencies..."
sudo apt-get install -y git curl build-essential

# Install Node.js if not already installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 for process management
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Clone or update repository
if [ -d "zyro" ]; then
    echo "Updating repository..."
    cd zyro
    git pull
else
    echo "Cloning repository..."
    git clone https://github.com/yourusername/zyro.git
    cd zyro
fi

# Install dependencies
echo "Installing application dependencies..."
npm install --production

# Set up environment variables
echo "Setting up environment variables..."
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    echo "DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/zyro" > .env
    echo "NODE_ENV=production" >> .env
    # Add other environment variables as needed
    echo "Please update the .env file with your actual database credentials"
fi

# Build the application
echo "Building the application..."
npm run build

# Start/restart the application using PM2
echo "Starting the application..."
pm2 stop zyro || true
pm2 start dist/index.js --name "zyro" --env production

# Configure PM2 to start on system reboot
echo "Configuring PM2 to start on boot..."
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

# Setup Nginx if not already configured
if ! command -v nginx &> /dev/null; then
    echo "Installing and configuring Nginx..."
    sudo apt-get install -y nginx
    
    # Create Nginx configuration
    sudo tee /etc/nginx/sites-available/zyro <<EOF
server {
    listen 80;
    server_name _;  # Change to your domain name

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/zyro /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test Nginx configuration
    sudo nginx -t
    
    # Restart Nginx
    sudo systemctl restart nginx
fi

echo "====== Deployment Complete ======"
echo "Your application should now be running at http://your-ec2-ip"
echo "Remember to update your DNS settings and configure SSL if needed" 