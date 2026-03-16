version: "3"

services:
  sochasse:
    build: .
    container_name: sochasse-app
    ports:
      - "3000:3000"
    restart: always
    volumes:
      - ./sochasse.db:/app/sochasse.db