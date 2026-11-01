# ProFlow - Project Management Application

ProFlow is a full-stack, collaborative project management application built with React, Node.js, and MongoDB. It provides a clean dashboard, interactive task management, and a highly responsive, collapsible sidebar interface to manage your workflows efficiently.

## Live Site
Check out the live application: **[https://proflow-task-manager.vercel.app](https://proflow-task-manager.vercel.app)**

The frontend is served from Vercel's edge network; the API runs on Render (free tier). See [Production Architecture](#production-architecture--cold-start-resilience) below.

---

## Production Architecture & Cold-Start Resilience

The API runs on Render's free tier, which spins the container down after inactivity. When the whole app was served from that container, a first visit sat on Render's "service waking up" screen for **~31.8 seconds** before any UI appeared.

| Layer | Host | Role |
|---|---|---|
| Frontend (React/Vite static bundle) | Vercel | Landing and login render immediately, even while the API is asleep |
| API (Express + Mongoose) | Render | `GET /api/health` is a zero-database endpoint used to wake the container |
| Database | MongoDB Atlas | Server only starts listening after `mongoose.connect()` succeeds |

What makes it work:
- **Decoupled delivery**: the static bundle is served from a CDN, so the page no longer waits on the API container.
- **Silent pre-warm**: on app mount, `App.jsx` sends `GET /health` in the background, so the container wakes while the user reads the page or types credentials.
- **Retry with backoff**: the Axios client (`frontend/src/services/api.js`) retries `502/503/504` up to 3 times (2s, 4s, 8s). Network errors and timeouts are retried only for `GET/HEAD/OPTIONS`, so a write is never duplicated.
- **Fail-fast boot**: if the initial MongoDB connection fails, the server logs the error and exits with code 1 so Render restarts it, rather than running without a database.
- **Scoped CORS**: the API only allows `FRONTEND_URL` and `http://localhost:5173`.

Measured on the live site (Chrome DevTools, cold container, single run): the login page loaded in **~0.7s**, the background wake-up (`/api/health`) completed in **~15s**, and login succeeded in **~1.3s** once awake. Wake-up time on the free tier varies.

Deployment settings:
- **Vercel**: Root Directory `frontend`; env `VITE_API_URL=https://<your-render-service>.onrender.com/api`. `frontend/vercel.json` rewrites all paths to `index.html` so deep links work.
- **Render**: env `FRONTEND_URL=https://<your-vercel-domain>` (no trailing slash), plus `MONGO_URI` and `JWT_SECRET`.

---

## Features

- **Responsive Dashboard**: Summary of total projects, active/completed tasks, overdue count, and recent task lists.
- **Collapsible Sidebar Navigation**:
  - Smooth animation (`transition-all duration-300`) to toggle between full view (`w-64`) and compact icon-only view (`w-20`).
  - Single-click toggle on the ProFlow logo.
  - Hover tooltips for quick navigation in compact mode.
  - State persistence in `localStorage` to keep your sidebar preference across page reloads.
- **Project Management**: Create and track multiple projects.
- **Task Management**: Kanban-style tasks with status tracking, due dates, and priorities.
- **User Authentication**: Secure signup and login with JWT and Redux State management.
- **Role-based Access**: Custom roles (Admin/Member) displayed dynamically.

---

## Tech Stack

- **Frontend**:
  - React 19
  - Redux Toolkit (State Management)
  - React Router (Client-side routing)
  - Tailwind CSS v4 (Styling)
  - Lucide React (Icons)
  - Vite (Fast development server & bundler)
- **Backend**:
  - Node.js & Express.js
  - MongoDB & Mongoose ODM
  - JSON Web Tokens (JWT) for authentication
  - Nodemon (Local auto-reload)

---

## Setup Instructions

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas URI)

### 2. Backend Environment Configuration
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/project-mgmt
JWT_SECRET=your_jwt_secret
```

### 3. Install Dependencies
Run the install command in the root project folder to install dependencies for the root, frontend, and backend packages:
```bash
npm run install-all
```

### 4. Run the Development Server
To launch both the Node.js API server and the Vite React frontend concurrently:
```bash
npm run dev
```
- The backend API runs on: `http://localhost:5000`
- The frontend client runs on: `http://localhost:5173` (or the next available port, e.g. `http://localhost:5175/`)
- A dev-server proxy is configured in Vite to automatically forward frontend `/api/*` requests to the backend server.