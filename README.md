# FT_TRANSCENDENCE

## Project Overview

ft_transcendence is a web-based Pong game with seamlessly integrated chat features. This project encompasses a wide range of functionalities, including two authentication methods: email-password and OAuth2.0 (42 intra). Additionally, we implemented Two-Factor Authentication (2FA) to enhance security. The entire project is developed using TypeScript, ensuring end-to-end type safety for a robust and reliable codebase.

## Tech Stack

### Backend:
- **NestJS:** Powerful backend development framework.
- **Prisma:** Modern, type-safe ORM for interfacing with databases.
- **PostgreSQL:** Robust and scalable relational database management system.
- **Swagger:** API documentation tool for clarity and ease of use.

### Frontend:
- **NextJS:** React framework for efficient and dynamic frontend development.
- **Tailwind CSS:** Utility-first CSS framework for rapid styling.
- **shadcn/ui:** Beautifully designed components built with Radix UI and Tailwind CSS.

## Key Features

1. **Authentication (entirely from scratch):**
   - Two authentication methods: email-password and OAuth2.0 with the 42 school.
   - Implementation of Two-Factor Authentication (2FA) for an added layer of security.
2. **Pong Game**
    - Matchmaking system for seamless player pairing.
    - Different maps to enhance gameplay variety.
    - Level badges to showcase player achievements and progression.
3. **Chat Features:**
   - Comprehensive chat system with direct messages and group chat capabilities.
   - Friend requests and user blocking functionalities.
   - Notifications system to keep users informed about relevant activities.

4. **Search Functionality:**
   - User-friendly search functionality to easily locate other users or groups.

5. **Group Management:**
   - Group features for owners and administrators, allowing actions such as kick, ban, and muting users for a specified period.
   - Robust group management capabilities, providing control over various aspects.

And Much More...


## Setup

To run the project using Docker, follow these steps:

1. Open a terminal in the root of the repository.
2. Run the following commands to build and run the project in detached mode:

```bash
# Configure environment variables
./scripts/setup-env

# add missing environment variables
# apps/api/.env
# If you won't use 42 intra for login, you can leave the following variables as they are:
# CLIENT_ID_42=CLIENT_ID_HERE
# CLIENT_SECRET_42=CLIENT_SECRET_HERE

# Run the project
docker compose up --build -d
```
 The application will be running at http://localhost:3000.
