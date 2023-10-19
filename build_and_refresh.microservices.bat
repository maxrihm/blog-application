@echo off

REM Stop and remove the existing containers if they exist
docker stop blogservice_container || echo No container named blogservice_container
docker rm blogservice_container || echo No container to remove named blogservice_container

docker stop userservice_container || echo No container named userservice_container
docker rm userservice_container || echo No container to remove named userservice_container

docker stop notificationservice_container || echo No container named notificationservice_container
docker rm notificationservice_container || echo No container to remove named notificationservice_container

REM Remove the existing images if they exist
docker rmi blogservice:latest || echo No image named blogservice:latest
docker rmi userservice:latest || echo No image named userservice:latest
docker rmi notificationservice:latest || echo No image named notificationservice:latest

REM Build the new Docker images
cd BlogService
docker build -t blogservice:latest .
cd ..

cd UserService
docker build -t userservice:latest .
cd ..

cd NotificationService
docker build -t notificationservice:latest .
cd ..

echo All done!
