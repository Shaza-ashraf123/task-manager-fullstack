# Task Manager (Full Stack)

A full stack task management app where each user registers, logs in, and manages their own private tasks.

## Live Demo
- **Frontend:** https://task-manager-fullstack123.vercel.app
- **API:** https://task-manager-fullstack-production-0b14.up.railway.app/api/health

> The backend runs on a free tier, so the first request may take a few seconds to wake up.

## Features
- User registration and login with JWT authentication
- Passwords hashed with bcrypt
- Protected routes (frontend and backend)
- Full CRUD for tasks (create, read, update, mark as done, delete)
- Each user can only access their own tasks
- Input validation and clear error messages

## Tech Stack
- **Frontend:** React, React Router, Axios, Vite
- **Backend:** Node.js, Express, JWT, bcryptjs
- **Database:** PostgreSQL (Neon)
- **Deployment:** Vercel (frontend), Railway (backend)

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Create an account |
| POST | /api/auth/login | No | Login and receive a JWT |
| GET | /api/tasks | Yes | List my tasks |
| POST | /api/tasks | Yes | Create a task |
| PUT | /api/tasks/:id | Yes | Update a task |
| DELETE | /api/tasks/:id | Yes | Delete a task |

Protected endpoints require the header: `Authorization: Bearer <token>`

## Run Locally

### 1. Clone
```bash
git clone https://github.com/Shaza-ashraf123/task-manager-fullstack.git
cd task-manager-fullstack
```

### 2. Database
Create a PostgreSQL database and run `server/schema.sql`.

### 3. Backend
```bash
cd server
npm install
cp .env.example .env   # then fill in your values
npm run dev
```

### 4. Frontend
```bash
cd client
npm install
```
Create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```
Then:
```bash
npm run dev
```

## Project Structure
```
client/   React app (pages, components, auth context)
server/   Express API (routes, middleware, db)
```

## Author
Shaza Ashraf, GitHub: [@Shaza-ashraf123](https://github.com/Shaza-ashraf123)