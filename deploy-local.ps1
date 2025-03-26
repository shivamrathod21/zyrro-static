# PowerShell script for deploying Zyro locally on Windows

Write-Host "====== Starting Zyro Local Deployment ======"

# Set environment variables
$env:NODE_ENV = "production"

# Build the application
Write-Host "Building the application..."
npm run build

# Start the server
Write-Host "Starting the server..."
node dist/index.js 