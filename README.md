# 🧠 AI LMS Project

Welcome to the **AI Learning Management System (LMS)**! This project is a modern, interactive, and beautifully designed full-stack web application designed for online learning. It features a responsive React frontend and a robust Laravel backend.

## 🚀 Features

* **Interactive Storefront:** Browse available courses with rich UI and dynamic animations.
* **Student Dashboard:** Track enrolled courses, view recent activities, and visualize learning progress.
* **Immersive Classroom:** A fully featured video learning interface with:
  * Dynamic video playback
  * Automatic progress tracking (watch time tracking via backend pings)
  * Gamified lesson completion (confetti animations!)
  * Interactive curriculum sidebar
* **Authentication System:** Secure user registration, login, and protected routes using Laravel Sanctum.
* **Beautiful UI/UX:** Built with Tailwind CSS and Framer Motion for smooth, highly interactive, and responsive micro-animations.

## 🛠️ Tech Stack

### Frontend
* **Framework:** React 18 (Vite)
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **Icons:** Lucide React
* **Routing:** React Router v6
* **Extras:** Canvas-confetti for gamification

### Backend
* **Framework:** Laravel (PHP)
* **Database:** SQLite / MySQL (configurable via `.env`)
* **Authentication:** Laravel Sanctum
* **API:** RESTful JSON API

## 📂 Folder Structure

The repository is organized into two main directories:

* `/frontend` - Contains the React Vite application.
* `/backend`  - Contains the Laravel application.

---

## 💻 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
* **Node.js** (v18+ recommended)
* **PHP** (v8.1+ recommended)
* **Composer**
* **Git**

### 1. Clone the repository
```bash
git clone https://github.com/Muhammadumad/curly-funicular.git
cd curly-funicular
```

### 2. Backend Setup
```bash
cd backend

# Install PHP dependencies
composer install

# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Start the Laravel development server
php artisan serve
```
The backend API will run on `http://127.0.0.1:8000`.

### 3. Frontend Setup
Open a new terminal window/tab:
```bash
cd frontend

# Install Node.js dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend will run on `http://localhost:5173`.

---

## 🌐 API Endpoints

A quick overview of the current backend routes:

**Public Routes:**
* `POST /api/register` - Register a new student.
* `POST /api/login` - Authenticate and get a token.
* `GET /api/courses` - Fetch available courses.
* `GET /api/courses/{slug}` - Fetch specific course details.

**Protected Routes (Requires Bearer Token):**
* `POST /api/logout` - Revoke token.
* `GET /api/user` - Get current authenticated user details.
* `POST /api/progress/ping` - Update video watch time and progress.
* `GET /api/courses/{slug}/progress` - Get student progress for a course.
* `GET /api/admin/dashboard` - Admin placeholder route.

---

## 🎨 Design System

The application relies heavily on a custom color palette tailored for an "AI/Tech" feel. It utilizes deep violets, cyans, and slate grays, combined with glassmorphism effects (`backdrop-blur`) to create a premium visual experience.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
