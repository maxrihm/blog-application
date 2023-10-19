@echo off

REM Get the directory where the batch file is located
set BATCH_PATH=%~dp0

cd %BATCH_PATH%

REM Run docker-compose up
docker-compose up

echo All services are up!
