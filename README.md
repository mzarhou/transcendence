# Transcendence
## Quick Start

### 1. Setup dependencies

```bash
# Install dependencies
yarn i

# Configure environment variables
# /apps/api
cp .env.example .env
# /apps/frontend
cp .env.example .env.local
# /packages/db
cp .env.example .env

# Push the Prisma migrations to the database
yarn db:push
```

### 2. Run dev scripts
```bash
# run docker containers (postgresql and redis)
docker-compose up --build -d

# run backend
yarn api:dev

# run frontend
yarn frontend:dev
```
