# Rider Bachat 🚴‍♂️

A **gamified savings app** for ride-share drivers to automatically save money from ride earnings and track progress toward financial goals.

![Tech Stack](https://img.shields.io/badge/React-Vite-blue) ![Backend](https://img.shields.io/badge/FastAPI-Python-green) ![Deployment](https://img.shields.io/badge/Vercel-Railway-blueviolet)

---

## 🎯 Problem & Solution

**Problem:** Ride-share drivers have volatile income and often struggle to save for emergencies (bike repairs, fuel increases).

**Solution:** Rider Bachat automatically saves 3% of each ride payment and uses gamification (XP, levels, badges, streaks) to encourage consistent saving behavior.

---

## ✨ Features

### Core

- 💰 **Wallet Management** — Track balance and payment history
- 💾 **Auto-Save** — 3% auto-save notification on each payment (user can accept/skip)
- 📊 **Savings Dashboard** — Real-time metrics (total saved, monthly, weekly, goal progress)

### Gamification

- 🏅 **Achievement Badges** — First Step, 7-Day Warrior, Community Star, Savings Pro, etc.
- 🎖️ **Level System** — Bronze → Silver → Gold → Platinum Saver
- 🔥 **Streak Counter** — Consecutive days of saving with flame emoji
- ⭐ **XP & Level System** — Earn XP for every save, unlock progressively harder levels
- 👥 **Community Counter** — Social proof ("12,847 riders saving like you!")

---

## 🛠️ Tech Stack

| Layer                | Technology                            |
| -------------------- | ------------------------------------- |
| **Frontend**         | React 19 + Vite + CSS3                |
| **Backend**          | FastAPI + Python 3.11                 |
| **Deployment**       | Vercel (Frontend) + Railway (Backend) |
| **State Management** | React Hooks                           |

---

## 📂 Project Structure

```
rider-bachat/
├── frontend/              # React + Vite app
│   ├── src/
│   │   ├── components/   # UI components (AutoSaveModal, BadgeGrid, etc.)
│   │   ├── pages/        # App pages (SavingsPage, WalletPage)
│   │   ├── services/     # API client (api.js)
│   │   └── App.jsx       # Main app component
│   ├── vite.config.js
│   ├── package.json
│   └── vercel.json       # Vercel deployment config
│
├── backend/              # FastAPI server
│   ├── main.py          # API routes & in-memory database
│   ├── requirements.txt  # Python dependencies
│   ├── Procfile         # Railway deployment config
│   └── runtime.txt      # Python version spec
│
├── docs/
│   └── prd.md           # Product Requirements Document
│
├── .gitignore
└── README.md            # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Git

### Run Locally

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 📋 API Endpoints

| Method | Endpoint              | Description                                   |
| ------ | --------------------- | --------------------------------------------- |
| `GET`  | `/rider/{id}`         | Rider profile with level & XP                 |
| `GET`  | `/rider/{id}/wallet`  | Balance + transaction history                 |
| `POST` | `/rider/{id}/payment` | Simulate incoming payment                     |
| `POST` | `/rider/{id}/save`    | Process save/skip decision                    |
| `GET`  | `/rider/{id}/savings` | Savings dashboard data                        |
| `GET`  | `/rider/{id}/badges`  | Earned/locked badges                          |
| `GET`  | `/community/stats`    | Community stats (total riders, daily joiners) |

**Full documentation:** See [docs/prd.md](docs/prd.md)

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variable: `VITE_API_URL=https://your-backend-url.railway.app`
4. Deploy automatically on push

**See:** [frontend/README.md](frontend/README.md)

### Backend (Railway)

1. Push to GitHub
2. Connect GitHub repo to Railway
3. Set environment variable: `ALLOWED_ORIGINS=https://your-frontend-url`
4. Deploy automatically on push

**See:** [backend/README.md](backend/README.md)

---

## 📦 Environment Variables

### Frontend (`.env.local`)

```
VITE_API_URL=https://your-backend-url.railway.app
```

### Backend (`.env`)

```
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

See `.env.example` files in each folder for details.

---

## 🤝 Contributing

This is a portfolio project. Contributions & feedback welcome!

---

## 📄 License

MIT License — feel free to use for learning or as a portfolio piece.

---

## 👤 Author

Built by [Your Name]

**Portfolio Link:** [your-portfolio-url]  
**Live Demo:** [deployment-url-here]

---

## 🎓 Learning Resources Used

- FastAPI Documentation: https://fastapi.tiangolo.com
- React + Vite: https://vitejs.dev/guide/ssr.html
- Vercel Deployment: https://vercel.com/docs
- Railway Deployment: https://docs.railway.app

---

## 📝 Notes

Currently using in-memory data storage for demo purposes. Future enhancements:

- PostgreSQL database integration
- Real payment gateway integration
- Authentication (JWT)
- WebSocket support for real-time notifications
- Mobile app (React Native)
