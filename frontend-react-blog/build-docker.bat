@echo off

REM Get the directory where the batch file is located
set BATCH_PATH=%~dp0
REM Change to the React app directory (assuming the batch file is located at the root of the React app)
cd %BATCH_PATH%

REM Compile the React app
npm run build

REM Stop and remove the existing Docker container (if it exists)
docker stop frontend_container
docker rm frontend_container

REM Delete the existing Docker image (if it exists)
docker rmi frontend-react-app:latest -f

REM Build the Docker image
docker build -t frontend-react-app:latest .

echo Image built successfully!

pause
