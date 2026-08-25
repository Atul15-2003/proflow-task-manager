# Deployment Guide

Steps to deploy the full-stack ProFlow application using **Render** for hosting and **MongoDB Atlas** for the database.

## Live Site Example
The application is live at: **[https://proflow-task-manager.onrender.com](https://proflow-task-manager.onrender.com)**

---

## 1. MongoDB Atlas Setup (Cloud Database)

1. **Sign Up / Log In**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. **Create a Database Cluster**: Create a free Shared Cluster (M0 tier) in your preferred region.
3. **Database Access User**:
   - Navigate to **Security > Database Access**.
   - Create a new database user.
   - Choose a password-based authentication mechanism and note down the password.
   - Assign the user `Read and write to any database` role.
4. **Network Access**:
   - Navigate to **Security > Network Access**.
   - Click **Add IP Address**.
   - Add `0.0.0.0/0` (Allow access from anywhere) to allow Render instances to connect to the database.
5. **Get the Connection URI**:
   - Go to **Database > Clusters > Connect**.
   - Choose **Connect your application**.
   - Copy the MongoDB Connection String/URI.
   - Format: `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/proflow?retryWrites=true&w=majority` (replace `<password>` with your database user's password).

---

## 2. GitHub Setup

1. Initialize git in the root folder (if not done already):
   ```bash
   git init
   ```
2. Create a `.gitignore` to exclude node modules, `.env` files, and build outputs:
   - Make sure `node_modules/` and `.env` are listed.
3. Add and commit all files:
   ```bash
   git add .
   ```
   ```bash
   git commit -m "Configure collapsible sidebar and deployment settings"
   ```
4. Push the code to a new or existing repository on GitHub.

---

## 3. Render Deployment (Web Service)

Render will build both the frontend and host the Node/Express backend from a single service because the backend is configured to serve the built frontend assets statically in production mode.

1. **Sign Up / Log In**: Log in to [Render](https://render.com/).
2. **Create a Web Service**:
   - Go to your Render Dashboard and click **New + > Web Service**.
   - Connect your GitHub account and select your `proflow-task-manager` repository.
3. **Configure Settings**:
   - **Name**: `proflow-task-manager`
   - **Environment / Runtime**: `Node`
   - **Branch**: `main` (or the branch you pushed your code to)
   - **Build Command**: `npm run build`
     - *Note: This script installs root, backend, and frontend dependencies, and compiles the React application into the `frontend/dist` directory.*
   - **Start Command**: `npm start`
     - *Note: In production mode, this runs `node backend/server.js` which spins up the Express server. The Express server serves frontend pages statically and handles API requests.*

---

## 4. Environment Variables on Render

In your Render Web Service settings, navigate to the **Environment** tab and add the following keys:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables Express static file serving for React build files |
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection URI (from Step 1) |
| `JWT_SECRET` | `your_jwt_secret_key` | Secret key used to sign and verify JSON Web Tokens |

*Render automatically assigns a `PORT` and manages routing/SSL for you.*

---

## 5. Deploy & Verify

1. Click **Deploy Web Service** at the bottom.
2. Monitor the Render deployment logs. You should see:
   - Dependency installation for the root, frontend, and backend packages.
   - Vite building the client code successfully.
   - The backend starting up: `Connected to MongoDB` and `Server running on port XXXX`.
3. Once the deployment status turns green (**Live**), click your Render URL to access the site!
