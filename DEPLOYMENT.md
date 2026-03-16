# Sochasse Nuxt App - Docker Deployment Guide

## Prerequisites

- Ubuntu Server 20.04+
- Docker installed
- Docker Compose installed

## Installation Steps

### 1. Install Docker on Ubuntu Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (optional, allows running docker without sudo)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### 2. Transfer Project to Server

**Option A: Using Git (Recommended)**
```bash
# On your local machine - commit and push to a repository
cd /Users/saiyadsamir/Documents/nuxtdemo/sochasse
git add .
git commit -m "Deploy to production"
git push origin main

# On your server
cd /var/www
git clone <your-repo-url> sochasse
cd sochasse
```

**Option B: Using SCP**
```bash
# From your local machine
cd /Users/saiyadsamir/Documents/nuxtdemo
scp -r sochasse user@your-server-ip:/var/www/
```

### 3. Build and Run with Docker Compose

```bash
cd /var/www/sochasse

# Build the Docker image
sudo docker compose build

# Start the container
sudo docker compose up -d

# Check status
sudo docker compose ps

# View logs
sudo docker compose logs -f
```

### 4. Access Your Application

Open your browser and go to:
- `http://your-server-ip:3000`

### 5. Setup Nginx Reverse Proxy (Optional - for Production)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/sochasse
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/sochasse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Setup SSL with Let's Encrypt (Optional)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### 7. Manage Your Container

```bash
# Start
sudo docker compose start

# Stop
sudo docker compose stop

# Restart
sudo docker compose restart

# View logs
sudo docker compose logs -f

# Rebuild after updates
sudo docker compose build
sudo docker compose up -d

# Stop and remove everything
sudo docker compose down
```

### 8. Backup Database

```bash
# Backup the SQLite database
sudo docker cp sochasse-app:/app/sochasse.db ./backup-sochasse.db

# Restore from backup
sudo docker cp backup-sochasse.db sochasse-app:/app/sochasse.db
```

### 9. Auto-start on Server Reboot

```bash
sudo docker compose up -d
# Docker Compose with restart: unless-stopped will auto-start
```

## Troubleshooting

**Check container logs:**
```bash
sudo docker compose logs -f
```

**Check if port 3000 is in use:**
```bash
sudo lsof -i :3000
```

**Restart the container:**
```bash
sudo docker compose restart
```

**Check disk space:**
```bash
df -h
```

## Environment Variables (Optional)

Create a `.env` file:
```env
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
```

Update `docker-compose.yml` to include:
```yaml
env_file:
  - .env
```

## Production Checklist

- [ ] Change default admin password
- [ ] Setup SSL certificate
- [ ] Configure firewall (ufw)
- [ ] Setup regular backups
- [ ] Monitor disk space
- [ ] Keep Docker images updated
