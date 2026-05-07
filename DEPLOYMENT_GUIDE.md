# Deployment Guide

Steps to deploy the application on Railway.

## 1. GitHub Setup
- Initialize git: `git init`
- Add and commit files.
- Push to a new GitHub repository.

## 2. Railway Deployment
- Link your GitHub repository to a new Railway project.
- Provision a MongoDB database on Railway.
- Configure the environment variables in the service settings.

## 3. Environment Variables
Add the following in Railway:
- `NODE_ENV`: `production`
- `MONGO_URI`: (Your Railway MongoDB connection string)
- `JWT_SECRET`: (Your secret key)
- `PORT`: `5000`

The application will be built and started automatically using the scripts in package.json.
