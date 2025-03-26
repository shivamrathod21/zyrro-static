# Start both frontend and backend servers
Write-Host "Starting development servers..."

# Start the backend server in a new window
Start-Process powershell -ArgumentList "-NoExit -Command `"$env:NODE_ENV='development'; npx tsx server/index.ts`""

# Start the frontend server in a new window
Start-Process powershell -ArgumentList "-NoExit -Command `"$env:NODE_ENV='development'; npx vite --host`""

Write-Host "Servers started! The website will be available at:"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend: http://localhost:3000" 