<div align="center">

<img src="https://img.shields.io/badge/Backend-Spacebook-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/Team-Group%204-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />

<br /><br />

# ⚙️ Spacebook — Backend

### *The engine behind the booking.*

**Backend service powering Spacebook — a dynamic slot booking platform for turfs and halls.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Overview](#-api-overview) • [Structure](#-project-structure)

</div>

---

## 🌱 About

This repository contains the backend service for **Spacebook**, handling space listings, seat/slot availability, and booking logic. It's built to serve the [spacebook](https://github.com/jeffmathew4545/spacebook) frontend as part of Group 4's mini project.

---

## ✨ Responsibilities

- **Space management** — create, update, and list turfs and halls
- **Seat/slot availability** — track and update real-time booking status
- **Booking logic** — reserve, confirm, and cancel bookings
- **Search** — serve filtered/search results to the frontend
- **Auth** — _(update: if user authentication is implemented)_

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | _(update: e.g. Node.js / Python)_ |
| **Framework** | _(update: e.g. Express.js / Django / FastAPI)_ |
| **Database** | _(update: e.g. MongoDB / PostgreSQL / MySQL)_ |
| **ORM / ODM** | _(update: e.g. Mongoose / Prisma / SQLAlchemy)_ |
| **Auth** | _(update, if applicable: JWT / sessions)_ |

> ℹ️ I don't have visibility into this repo's actual dependency file — send `package.json` (or `requirements.txt` / equivalent) and I'll fill this table in precisely.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18 *(or the relevant runtime for your stack)*
- A running database instance

### 1. Clone the repository

```bash
git clone https://github.com/jeffmathew4545/spacebook-backend.git
cd spacebook-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL=your_database_url_here
JWT_SECRET=your_jwt_secret_here
```

> ⚠️ Never commit your `.env` file — add it to `.gitignore`.

### 4. Run the server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

---

## 📡 API Overview

| Method | Endpoint | Description |
|--------|----------|--------------|
| `GET` | `/api/spaces` | Fetch all available spaces |
| `GET` | `/api/spaces/:id` | Fetch a single space's details |
| `GET` | `/api/spaces/search` | Search spaces by filters |
| `POST` | `/api/bookings` | Create a new booking |
| `GET` | `/api/bookings/:userId` | Fetch a user's bookings |
| `DELETE` | `/api/bookings/:id` | Cancel a booking |

> ⚠️ These routes are illustrative — replace with your actual route definitions from the codebase.

---

## 🏗 Project Structure

```
spacebook-backend/
├── src/
│   ├── controllers/     # Route handler logic
│   ├── models/          # Database schemas
│   ├── routes/          # API route definitions
│   ├── middleware/       # Auth, error handling, validation
│   └── config/           # DB connection, env config
├── server.js / index.js  # Entry point
└── package.json
```

> Update this tree to match your actual folder layout.

---

## 🗺 Roadmap

- [ ] User authentication & role-based access (owner vs. renter)
- [ ] Payment gateway integration
- [ ] Booking conflict handling & concurrency safety
- [ ] Admin endpoints for managing listings
- [ ] Rate limiting & request validation

---

## 👥 Team

**Group 4 — Mini Project**

- [jeffmathew4545](https://github.com/jeffmathew4545)
- [SouravSasidharan](https://github.com/SouravSasidharan)

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Spacebook Backend — Group 4**

</div>
