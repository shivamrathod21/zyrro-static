# Kill any existing Node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Start the backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd G:\zyro; npm run build; node dist/index.js"

# Wait a moment for the backend to start
Start-Sleep -Seconds 2

# Start the frontend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd G:\zyro; npm run dev"

Write-Host "Servers started! The website will be available at:"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend: http://localhost:3000" 