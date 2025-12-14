# 🍬 Sweet Shop Management System

A full-stack web application to manage sweets inventory, sales, and authentication.

---

## 📦 Tech Stack

**Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Jest (Testing)

**Frontend**

* React
* Vite
* Axios
* React Router

---

## 📁 Project Structure

```
sweet-shop-management-system/
│
├── backend/
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

* Node.js ≥ 18
* npm ≥ 9
* MongoDB (local OR Atlas)
* Git

Verify:

```bash
node -v
npm -v
```

---

## 🔧 Backend Setup (Local)

### 1️⃣ Navigate to backend

```bash
cd backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env` file

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/sweet-shop

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1h

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
```

> Use long random strings for secrets in real projects.

---

### 4️⃣ Start backend server

```bash
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

## 🧪 Backend Testing

Uses **Jest + MongoDB Memory Server**

```bash
npm test
```

Expected output:

```
Test Suites: all passed
Tests: all passed
```

---

## 🎨 Frontend Setup (Local)

### 1️⃣ Navigate to frontend

```bash
cd ../frontend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env` file

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### 4️⃣ Start frontend dev server

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🔗 Connecting Frontend ↔ Backend

Frontend communicates with backend via:

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

Ensure:

* Backend is running on port `5000`
* Frontend `.env` matches backend URL

---

## 🔐 Authentication Flow

* Register → `/api/auth/register`
* Login → `/api/auth/login`
* Access Token → Short-lived JWT
* Refresh Token → Stored in DB
* Protected routes use JWT middleware

---

## 🚀 Common Commands

### Backend

```bash
npm run dev     # Start server
npm test        # Run tests
```

### Frontend

```bash
npm run dev     # Start frontend
npm run build   # Production build
```