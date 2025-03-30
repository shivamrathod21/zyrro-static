# AWS Deployment Guide for Zyro Visuals

This guide will walk you through deploying the Zyro Visuals website on AWS using EC2 t2.micro and RDS MySQL.

## Prerequisites

1. AWS Account with access to EC2 and RDS services
2. AWS CLI installed and configured
3. Node.js and npm installed on your local machine
4. Git installed on your local machine

## Step 1: Set Up RDS MySQL Database

1. Go to AWS RDS Console
2. Click "Create database"
3. Choose the following settings:
   - Engine type: MySQL
   - Version: MySQL 8.0.28
   - Templates: Free tier
   - DB instance identifier: zyro-db
   - Master username: admin
   - Master password: (create a secure password)
   - Instance configuration: db.t3.micro
   - Storage: 20 GB
   - VPC: Default VPC
   - Public access: Yes (for development, consider No for production)
   - VPC security group: Create new
   - Security group name: zyro-db-sg
   - Initial database name: zyro_db

4. Create the security group rule:
   - Type: MySQL/Aurora
   - Port: 3306
   - Source: Your EC2 security group (will create later)

5. Note down the endpoint URL after the database is created

## Step 2: Launch EC2 Instance

1. Go to EC2 Console
2. Click "Launch Instance"
3. Configure instance:
   - Name: zyro-web-server
   - AMI: Amazon Linux 2023
   - Instance type: t2.micro
   - Key pair: Create new or use existing
   - VPC: Default VPC
   - Security group: Create new
   - Security group name: zyro-web-sg
   - Add inbound rules:
     - HTTP (80)
     - HTTPS (443)
     - SSH (22)
   - Storage: 8 GB gp3

4. Launch instance and wait for it to start

## Step 3: Configure EC2 Instance

1. SSH into your EC2 instance:
```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

2. Update system and install dependencies:
```bash
sudo yum update -y
sudo yum install -y git nodejs npm
```

3. Install Node.js 18:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

4. Install PM2 for process management:
```bash
npm install -g pm2
```

5. Clone your repository:
```bash
git clone https://github.com/yourusername/zyro-visuals.git
cd zyro-visuals
```

## Step 4: Configure Environment Variables

Create a .env file in your project root:
```bash
touch .env
```

Add the following variables:
```env
DATABASE_URL=mysql://admin:your-password@your-rds-endpoint:3306/zyro_db
NODE_ENV=production
PORT=3000
```

## Step 5: Update Database Configuration

1. Update drizzle.config.ts:
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql2",
  dbCredentials: {
    uri: process.env.DATABASE_URL,
  },
});
```

2. Install MySQL dependencies:
```bash
npm install mysql2
```

## Step 6: Build and Deploy

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

3. Run database migrations:
```bash
npm run db:push
```

4. Start the application with PM2:
```bash
pm2 start dist/index.js --name zyro-web
```

5. Configure PM2 to start on system boot:
```bash
pm2 startup
pm2 save
```

## Step 7: Set Up Nginx as Reverse Proxy

1. Install Nginx:
```bash
sudo yum install -y nginx
```

2. Create Nginx configuration:
```bash
sudo nano /etc/nginx/conf.d/zyro.conf
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Start and enable Nginx:
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 8: Set Up SSL (Optional but Recommended)

1. Install Certbot:
```bash
sudo yum install -y certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d your-domain.com
```

## Monitoring and Maintenance

1. Monitor logs:
```bash
pm2 logs
```

2. Monitor application status:
```bash
pm2 status
```

3. Update application:
```bash
cd ~/zyro-visuals
git pull
npm install
npm run build
pm2 restart zyro-web
```

## Troubleshooting

1. Check application logs:
```bash
pm2 logs zyro-web
```

2. Check Nginx logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

3. Check MySQL connection:
```bash
mysql -h your-rds-endpoint -u admin -p
```

4. Common issues:
   - Database connection errors: Check security group rules
   - 502 Bad Gateway: Check if Node.js application is running
   - Permission issues: Check file ownership and permissions

## Security Best Practices

1. Keep system updated:
```bash
sudo yum update -y
```

2. Use strong passwords for database and EC2 instance
3. Regularly backup your database
4. Monitor AWS CloudWatch metrics
5. Set up AWS WAF for additional security
6. Enable VPC flow logs
7. Use AWS Secrets Manager for sensitive data

## Backup and Recovery

1. Set up automated RDS snapshots
2. Configure EC2 AMI backups
3. Store application data in S3 buckets
4. Document recovery procedures

Remember to replace placeholders like `your-domain.com`, `your-password`, and `your-rds-endpoint` with your actual values.

For any issues during deployment, check the application logs and AWS CloudWatch metrics for debugging information. 