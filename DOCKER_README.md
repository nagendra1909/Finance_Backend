# Finance Backend - Docker Setup

This document explains how to build and run the Finance Backend application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

## Building the Docker Image

To build the Docker image locally:

```bash
docker build -t finance-backend:latest .
```

## Running with Docker

### Method 1: Using Docker Run

```bash
# Run the container with environment file
docker run --rm -p 5000:5000 --env-file .env finance-backend:latest

# Or run in detached mode
docker run -d -p 5000:5000 --env-file .env --name finance-backend-app finance-backend:latest
```

### Method 2: Using Docker Compose

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## Environment Variables

Make sure you have a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="your-postgresql-connection-string"
```

## API Endpoints

Once running, the application will be available at `http://localhost:5000` with the following endpoints:

- `POST /customers` - Add a new customer
- `GET /customers` - Get all customers
- `POST /payments` - Add a payment
- `GET /customers/:id/payments` - Get payments for a customer
- `GET /customers/:id/summary` - Get customer summary

## Docker Image Details

- **Base Image**: Node.js 18 Alpine
- **Size**: ~1GB
- **Port**: 5000
- **User**: Non-root user (nextjs)
- **Health Check**: Included in docker-compose setup

## Troubleshooting

1. **Port already in use**: Change the port mapping in docker run command or docker-compose.yml
2. **Database connection issues**: Ensure your DATABASE_URL is correct and accessible from the container
3. **Build issues**: Make sure all dependencies are properly installed

## Development

For development, you can mount the source code as a volume:

```bash
docker run --rm -p 5000:5000 --env-file .env -v $(pwd):/app finance-backend:latest
```
