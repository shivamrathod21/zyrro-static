# Stop any existing Node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Set environment variables
$env:NODE_ENV = "development"

# Build and start the server
Write-Host "Building and starting the server..."
npm run build
if ($LASTEXITCODE -eq 0) {
    Start-Process powershell -ArgumentList "node dist/index.js" -NoNewWindow
    Write-Host "Backend server started on http://localhost:3000"
    
    # Wait a moment for the backend to start
    Start-Sleep -Seconds 2
    
    # Start the frontend development server
    Write-Host "Starting frontend development server..."
    npm run dev
} else {
    Write-Host "Build failed. Please check the errors above."
    exit 1
} 