# Classroom Management System

A full-stack web application for managing classrooms, assignments, enrollments, and announcements. Built with React and Node.js.

## Features

- User authentication (Student, Teacher, Admin)
- Department and subject management
- Class creation and enrollment
- Assignment submission
- Announcements and notifications
- Dashboard with statistics

## Tech Stack

**Frontend:** React, Vite, React Router  
**Backend:** Node.js, Express  
**Database:** MySQL with Sequelize ORM

## Prerequisites

Make sure you have these installed:
- Node.js (v16 or higher)
- npm (comes with Node.js)
- MySQL (v8.0 or higher)

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Classroom-Management
```

### 2. Database Setup

First, install and start MySQL if you haven't already:

```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

Then create the database and user:

```bash
sudo mysql -u root -p
```

Run these SQL commands:

```sql
CREATE DATABASE classroom_db;
CREATE USER 'classroomuser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON classroom_db.* TO 'classroomuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Or use the provided script:

```bash
chmod +x setup-database.sh
./setup-database.sh
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your database password and JWT secret:

```env
PORT=3000
JWT_SECRET=your_strong_secret_key_here
DB_PASSWORD=your_mysql_password
```

### 4. Install Dependencies

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
cd ..
```

### 5. Run Database Migrations

```bash
cd backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
cd ..
```

## Running the Application

### Option 1: Using the provided scripts

Frontend:
```bash
chmod +x run-frontend.sh
./run-frontend.sh
```

Backend:
```bash
chmod +x run-backend.sh
./run-backend.sh
```

### Option 2: Manual commands

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`  
The backend API will run on `http://localhost:3000`

## Default Admin Credentials

Check the `ADMIN_CREDENTIALS.md` file for default login credentials.

## Project Structure

```
├── backend/          # Express API server
├── src/             # React frontend
├── public/          # Static assets
└── .env.example     # Environment variables template
```

## Troubleshooting

**Database connection fails?**  
Check your MySQL credentials in the `.env` file and make sure MySQL service is running.

**Port already in use?**  
Change the PORT in `.env` file or kill the process using that port.

**Dependencies not installing?**  
Delete `node_modules` and `package-lock.json`, then run `npm install` again.
