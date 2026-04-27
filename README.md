# Brain Box: Engaging E-Learning System

A premium, production-ready Learning Management System built with
React + Vite (frontend) and Node.js + Express + MongoDB (backend).
---

## 🚀 Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS            |
| Backend  | Node.js, Express 4                      |
| Database | MongoDB 6 via Mongoose                  |
| Auth     | JWT (jsonwebtoken) + bcryptjs           |

---

## 📁 Project Structure

```
lms/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI (Layout, CourseCard)
│   │   ├── contexts/         # AuthContext (global auth state)
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── student/      # Dashboard, CoursePage, QuizPage, Leaderboard, Explore
│   │   │   └── teacher/      # Dashboard, CreateCourse, ManageCourse
│   │   ├── services/         # Axios API instance
│   │   ├── App.jsx           # Routes
│   │   ├── main.jsx
│   │   └── index.css         # Tailwind + custom styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                   # Node/Express backend
    ├── controllers/          # authController, courseController, quizController, leaderboardController
    ├── middleware/           # JWT protect + teacherOnly guards
    ├── models/               # User, Course, Quiz (Mongoose schemas)
    ├── routes/               # /api/auth  /api/courses  /api/quiz  /api/leaderboard
    ├── seed.js               # One-time demo data seed
    ├── server.js             # App entry point
    ├── .env                  # Environment variables (edit before running)
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally (`mongod`) **or** a MongoDB Atlas connection string

---

## 🔧 Setup & Running

### 1 — Configure environment

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lms
JWT_SECRET=change_this_to_a_long_random_string
```

### 2 — Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3 — Seed demo data (optional but recommended)

```bash
cd server
node seed.js
```

This creates:
- 👨‍🏫 **Teacher** → `teacher@demo.com` / `demo1234`
- 🎓 **Student** → `student@demo.com` / `demo1234`
- 6 published courses across Mathematics, Physics, Python, Chemistry, Biology, English
- 6 quizzes (one per course's first module)
- 6 extra student accounts with varying points

### 4 — Start the servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

### 5 — Open the app

```
http://localhost:5173
```

---

## 🔑 API Reference

### Auth  `/api/auth`
| Method | Path          | Auth | Description        |
|--------|---------------|------|--------------------|
| POST   | `/register`   | —    | Create account     |
| POST   | `/login`      | —    | Login, returns JWT |
| GET    | `/me`         | JWT  | Current user info  |

### Courses  `/api/courses`
| Method | Path                         | Auth         | Description                    |
|--------|------------------------------|--------------|--------------------------------|
| GET    | `/`                          | —            | All published courses          |
| GET    | `/teacher`                   | Teacher      | Teacher's own courses          |
| GET    | `/:id`                       | JWT          | Single course (with lock data) |
| POST   | `/`                          | Teacher      | Create course                  |
| PUT    | `/:id`                       | Teacher      | Update course                  |
| DELETE | `/:id`                       | Teacher      | Delete course                  |
| POST   | `/:id/enroll`                | Student      | Enroll in course               |
| POST   | `/:id/publish`               | Teacher      | Toggle publish status          |
| POST   | `/:id/modules`               | Teacher      | Add module                     |
| PUT    | `/:id/modules/:moduleId`     | Teacher      | Edit module                    |
| DELETE | `/:id/modules/:moduleId`     | Teacher      | Delete module                  |
| POST   | `/modules/:moduleId/complete`| Student      | Mark module complete           |

### Quiz  `/api/quiz`
| Method | Path                  | Auth    | Description             |
|--------|-----------------------|---------|-------------------------|
| GET    | `/module/:moduleId`   | JWT     | Quiz for a module       |
| GET    | `/course/:courseId`   | Teacher | All quizzes for course  |
| GET    | `/:id`               | JWT     | Single quiz (no answers)|
| POST   | `/`                   | Teacher | Create/update quiz      |
| POST   | `/:id/submit`         | Student | Submit quiz & get score |
| PUT    | `/:id`               | Teacher | Update quiz             |
| DELETE | `/:id`               | Teacher | Delete quiz             |

### Leaderboard  `/api/leaderboard`
| Method | Path        | Auth | Description            |
|--------|-------------|------|------------------------|
| GET    | `/`         | JWT  | Top 50 students        |
| GET    | `/my-rank`  | JWT  | Current user's rank    |

---

## ✨ Features

### Student
- 📊 Dashboard with enrolled courses, stats, and recommendations
- 🔍 Explore page with search, category, and level filters
- 📹 Course page with YouTube video embed and locked/unlocked module sidebar
- 📝 MCQ quiz with timer, instant scoring, and answer review
- 🔓 Auto-unlock next module after passing quiz (≥60%)
- ⭐ Points earned for passing quizzes
- 🏆 Leaderboard with podium display

### Teacher
- 📚 Teacher dashboard with course stats
- ➕ Create courses (title, description, category, level, thumbnail, tags)
- 🎥 Add / delete video modules (YouTube URL or direct URL)
- 📝 Create / edit / delete MCQ quizzes per module
- ✅ Publish / unpublish courses

---

## 🎨 Design Highlights

- **Fonts:** Plus Jakarta Sans (headings) + DM Sans (body)
- **Color palette:** Brand red (#e84a3a) + Ocean blue (#3b97f3)
- **UI:** Card-based, glassmorphism accents, smooth hover transitions
- **Responsive:** Mobile sidebar, hamburger nav, flexible grids
- **Animations:** fade-in, slide-up, skeleton loaders

---

## 🔒 Security Notes

- Passwords hashed with bcrypt (salt rounds: 12)
- JWT tokens expire in 30 days
- Teacher-only routes protected by `teacherOnly` middleware
- Module video URLs hidden from unenrolled students

---

## 📄 License

MIT — free to use and modify.
