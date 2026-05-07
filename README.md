# Project Management Application

A full-stack project management application built with React, Node.js, and MongoDB.

## Features
- User Authentication (Login/Signup)
- Project Management (Create/Edit/Delete)
- Task Management (Kanban Board)
- Role-based Access (Admin/Member)
- Responsive Dashboard with Progress Stats

## Tech Stack
- Frontend: React, Tailwind CSS, Redux Toolkit
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose

## Setup Instructions

### 1. Backend Configuration
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### 2. Install Dependencies
Run the following in the root directory:
```bash
npm run install-all
```

### 3. Run the App
```bash
npm run dev
```
The app will be available at http://localhost:5173
