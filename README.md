<div align="center">
  <img src="frontend/src/assets/logo.png" width="150" alt="PENNYwise Logo">

  # PENNYwise Spending Tracker

  **Track, manage, and optimize your subscriptions — all in one place.**

  ![Node](https://img.shields.io/badge/node-%3E%3D18-green)
  ![Stack](https://img.shields.io/badge/stack-Express%20%2B%20React-blueviolet)
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
</div>

---

## Features

- **Dashboard** — Get a quick overview of your monthly spending
- **Subscription Management** — Add, edit, and remove subscriptions with ease
- **Analytics** — Visualize spending trends
- **Savings** — Identify opportunities to cut costs
- **Comparison** — Compare subscription plans side by side
- **Notifications** — Stay on top of upcoming renewals and changes

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and set your session secret:

```bash
cp .env.example .env
```

Then open `.env` and update:

```env
SESSION_SECRET="your-own-secret-key"
```

### 3. Run the app

```bash
npm run dev
```

Open your browser at **http://localhost:5173/**

---

## Scripts

| Command         | Description                                    |
|-----------------|------------------------------------------------|
| `npm run dev`   | Start frontend and backend in development mode |
| `node --test`   | Run all tests                                  |
| `npm run build` | Build the frontend for production              |

---

## Tech Stack

| Layer    | Technology                  |
| -------- | --------------------------- |
| Frontend | React, Vite                 |
| Backend  | Node.js, Express            |
| Database | SQLite                      |
| Auth     | express-session, bcrypt     |