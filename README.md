# ProFlow - Project Management Application

ProFlow is a full-stack, collaborative project management application built with React, Node.js, and MongoDB. It provides a clean dashboard, interactive task management, and a highly responsive, collapsible sidebar interface to manage your workflows efficiently.

## Live Site
Check out the live application on Render: **[https://proflow-task-manager.onrender.com](https://proflow-task-manager.onrender.com)**

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