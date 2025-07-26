@echo off
echo Starting services...
docker-compose up --build
echo Services are running.
echo Frontend is available at http://localhost:8080
echo Backend API is available at http://localhost:3000