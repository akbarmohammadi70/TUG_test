# DevOps Hands-On Project

A local development environment with Frontend (Next.js) and Backend (NestJS) applications communicating via REST API. This project also includes Redis for caching and Nginx as a reverse proxy with gzip and caching capabilities.

## Project Structure
project-root/
├─ backend/
│ ├─ src/
│ ├─ package.json
│ ├─ Dockerfile
│ └─ ...
├─ frontend/
│ ├─ app/
│ ├─ public/
│ ├─ Dockerfile
│ └─ ...
├─ nginx/
│ └─ nginx.conf
├─ docker-compose.yml
├─ .env
├─ .gitlab-ci.yml
└─ README.md

## Environment Variables

### Backend
Environment variables are defined in `.env`:

BACKEND_PORT=3001
REDIS_HOST=redis
REDIS_PORT=6379
CACHE_TTL=60


### Frontend
Frontend currently doesn't use any environment variables.

## Service Ports

| Service   | Port  |
|-----------|-------|
| Frontend  | 3000  |
| Backend   | 3001  |
| Redis     | 6379  |
| Nginx     | 80    |

## Setup and Installation

### Prerequisites
- Docker
- Docker Compose

### Running the Project

```bash
# Build and start all containers
docker-compose up -d --build

# Verify running containers
docker ps

Testing the Services
Backend API Test
curl http://localhost/api/data

Expected Response: {"message":"Hello from NestJS backend!"}

Redis Caching Test

# Access backend container
docker exec -it backend sh

# Connect to Redis
redis-cli -h redis -p 6379

# View cached keys
KEYS *

# Get cached data
GET cachedData

Cache Invalidation

curl http://localhost/api/invalidate

Frontend Test
Open your browser and navigate to: http://localhost

Nginx Caching Test

curl -I http://localhost/api/data

- First request: X-Cache-Status: MISS
- Subsequent requests: X-Cache-Status: HIT

Key Features
- Multi-stage Docker builds for both backend and frontend to reduce image size

- Redis caching implemented for /api/data endpoint

- Nginx reverse proxy with gzip compression and caching enabled

- Containerized development environment

Useful Commands

# Follow backend logs
docker logs -f backend

# Follow Nginx logs
docker logs -f nginx

# Stop and remove all containers
docker-compose down

# View container status
docker-compose ps

GitLab CI/CD Pipeline
GitLab Runner Setup
To run the CI/CD pipeline, install and register a GitLab Runner on your host:

Install GitLab Runner on Ubuntu/Debian:

curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | sudo bash
sudo apt-get install gitlab-runner -y

Register the runner with your GitLab project:

sudo gitlab-runner register

URL: Your GitLab instance (e.g., https://gitlab.com/)

Token: Registration token from Settings > CI/CD > Runners

Description: e.g., docker-runner

Tags: Optional, e.g., docker

Executor: docker

Default image: docker:24.0.5

Start the runner:

sudo gitlab-runner start
sudo gitlab-runner status

Deploy Stage Configuration
The Deploy stage builds Docker images and runs services using Docker Compose. It runs only on the main branch to ensure production deployment from mainline code.

Sample .gitlab-ci.yml:

stages:
  - deploy

deploy:
  stage: deploy
  image: docker:24.0.5
  services:
    - docker:24.0.5-dind
  script:
    # Build Docker images for all services
    - docker compose -f docker-compose.yml build
    
    # Start containers in detached mode
    - docker compose -f docker-compose.yml up -d
    
    # List running containers
    - docker ps
  only:
    - main

Explanation
Image: Uses docker:24.0.5 for Docker command availability

Services: docker:24.0.5-dind enables Docker-in-Docker for building and running containers

Script Steps:

docker compose build: Builds all images from docker-compose.yml

docker compose up -d: Starts containers in detached mode

docker ps: Lists running containers for deployment verification

Only: Ensures deployment runs exclusively on the main branch

Next Steps
Create GitLab CI/CD pipeline for build, test, and deploy

Simulate Cloudflare protection (DNS setup, caching levels, rate limiting, firewall rules)

Complete documentation of configuration files and folder structure

Troubleshooting
Common Issues
Port conflicts: Ensure ports 80 are available

Container startup failures: Check logs with docker logs <container_name>

Redis connection issues: Verify Redis container is running and network connectivity

Logs Inspection

# Check all service logs
docker-compose logs

# Check specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx
docker-compose logs redis

### Simulate Cloudflare Protection
Although Cloudflare is not directly configured in this environment, we can simulate its security and performance features through DNS, caching, rate-limiting, and firewall examples.

1️⃣ DNS Setup

In Cloudflare (or simulation):

A Record → example.com → <server-public-ip>

CNAME Record → www → example.com

Proxy Status: Enabled (orange cloud ☁️)

SSL/TLS Mode: Full or Full (Strict)


2️⃣ Caching Configuration

Caching Level: Standard (Cache static assets like .js, .css, .png, .jpg)

Edge Cache TTL: 1 hour

Browser Cache TTL: 5 minutes

Bypass Cache on Cookie: session_id or API endpoints like /api/*

3️⃣ Rate Limiting

Protect your backend against excessive requests:

Rule:
Path → /api/*
Limit → 100 requests per 10 minutes per IP
Action → Block or Challenge
Response → 429 Too Many Requests

4️⃣ Firewall Rules (Example)

To enhance security and control access to the application, several Cloudflare firewall rules can be configured. For example, you can block known bots using the expression (cf.client_bot) with the Block action to prevent automated scraping. To protect sensitive areas, such as administrative routes, use (http.request.uri.path contains "/admin") and set the action to Challenge, ensuring only authorized users can access them. You can also restrict traffic to a specific country — for instance, blocking all requests where (ip.geoip.country ne "US"). Additionally, to prevent SQL injection attacks, use a rule such as (http.request.uri.query matches "(?i)(union|select)") and set it to Block. These rules collectively strengthen your application’s perimeter defense by filtering unwanted or malicious requests before they reach your servers.


License
This project is licensed under the MIT License.