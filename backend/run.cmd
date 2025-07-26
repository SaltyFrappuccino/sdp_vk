@echo off
docker run --rm -p 3000:3000 -v "%cd%/anketi.db:/app/anketi.db" --name anketnica-backend-container anketnica-backend