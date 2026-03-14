# Backend: Rider Bachat API

FastAPI-powered REST API for the Rider Bachat savings app.

## 🚀 Features

- **RESTful API** — Standard HTTP endpoints for CORS-enabled requests
- **In-Memory Database** — Fast mocking & prototyping (can be swapped for PostgreSQL)
- **Gamification Logic** — XP, levels, badges, streak calculation
- **Auto-Save Simulation** — Simulates ride payments with save notifications

## 🛠️ Tech Stack

- **FastAPI** — Modern Python web framework
- **Uvicorn** — ASGI server (high performance)
- **Pydantic** — Data validation
- **CORS Middleware** — Cross-Origin Resource Sharing support

## 📂 Structure

```
backend/
├── main.py              # All API routes, models, and in-memory DB
├── requirements.txt     # Python dependencies
├── Procfile            # Railway deployment config
├── runtime.txt         # Python version specification
└── README.md           # This file
```

## 🔗 API Endpoints

### Rider Profile

```
GET /rider/{rider_id}
```

Returns rider profile with XP, level, streak, badges, etc.

**Example Response:**

```json
{
  "id": 1,
  "name": "Ahmed Khan",
  "xp": 450,
  "streak": 7,
  "level": "Silver Saver",
  "level_icon": "🥈",
  "balance": 4850.00,
  "total_saved": 2340.00,
  "goal_progress": 46.8,
  ...
}
```

### Wallet & Transactions

```
GET /rider/{rider_id}/wallet
```

Fetch balance and recent transaction history.

### Savings Dashboard

```
GET /rider/{rider_id}/savings
```

All metrics for the savings dashboard (monthly saved, weekly saved, goal progress, etc.).

### Process Payment

```
POST /rider/{rider_id}/payment
Body: { "amount": 250.0, "customer_name": "Ali H." }
```

Simulates receiving a payment from a ride customer.

### Process Save Decision

```
POST /rider/{rider_id}/save
Body: { "transaction_id": 1, "accept": true, "amount": 10.5 }
```

Handle rider's decision to save or skip.

### Badges

```
GET /rider/{rider_id}/badges
```

List of earned and locked achievement badges.

### Community Stats

```
GET /community/stats
```

Total riders saving, daily joiners, etc.

**See [docs/prd.md](../docs/prd.md) for full API specification.**

## 🚀 Getting Started

### Prerequisites

- Python 3.11+ (check with `python --version`)
- pip (comes with Python)

### Installation

1. **Create Virtual Environment**

   ```bash
   python -m venv venv
   ```

2. **Activate Virtual Environment**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Run Development Server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

**Try it:**

- Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI)
- Or `http://localhost:8000/redoc` for ReDoc documentation

### Run Production Server

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## 📦 Environment Variables

Create `.env` file in the `backend/` folder (not tracked by git):

```
# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Deployment
ENVIRONMENT=development
```

**Required for Production:**

- `ALLOWED_ORIGINS` — Comma-separated list of allowed frontend domains
- `ENVIRONMENT` — Set to "production" when deployed

See `.env.example` for all available options.

## 🚢 Deployment

### Railway (Recommended)

1. **Push to GitHub**
   - Ensure all code is committed and pushed
   - Repository should be public or Railway should have access

2. **Connect to Railway**
   - Go to railway.app → Dashboard
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `rider-bachat` repository
   - Click "Deploy Now"

3. **Configure Build**
   - Railway auto-detects Python project
   - Specifies root directory: `backend/`
   - Sets start command from `Procfile`

4. **Set Environment Variables**
   - In Railway Dashboard → Project Settings → Variables
   - Add:
     ```
     ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
     ENVIRONMENT=production
     ```

5. **View Logs & Get URL**
   - Railway will provide your API URL (e.g., `https://rider-bachat-api-prod.railway.app`)
   - Check logs for any errors
   - API will auto-redeploy on every push to `main` branch

### Alternative: Render

1. Go to render.com → Dashboard
2. Click "New+" → "Web Service"
3. Connect GitHub repo
4. Configure:
   - Build command: `pip install -r backend/requirements.txt`
   - Start command: `cd backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`
   - Root directory: `backend/`
5. Add environment variables same as Railway

### Alternative: Heroku (older, may require credit card)

```bash
heroku login
heroku create rider-bachat-api
git push heroku main
heroku config:set ALLOWED_ORIGINS="https://your-frontend-url"
```

## 🧪 Testing

### Manual API Testing

Using `curl`:

```bash
# Get rider profile
curl http://localhost:8000/rider/1

# Simulate payment
curl -X POST http://localhost:8000/rider/1/payment \
  -H "Content-Type: application/json" \
  -d '{"amount": 500, "customer_name": "Ali H."}'

# Process save
curl -X POST http://localhost:8000/rider/1/save \
  -H "Content-Type: application/json" \
  -d '{"transaction_id": 1, "accept": true, "amount": 15.0}'
```

### Using Swagger UI

- Visit `http://localhost:8000/docs`
- Try endpoints directly in the browser

## 🔒 Security Considerations

### Current (Development)

- ✅ CORS restricted to frontend URL (environment-based)
- ✅ Only allows `GET` and `POST` methods
- ✅ No hardcoded API keys or secrets
- ⚠️ In-memory storage (data resets on server restart)

### For Production

- 🔄 Add database (PostgreSQL) for persistence
- 🔐 Implement authentication (JWT tokens)
- 🛡️ Add rate limiting
- 📊 Add request logging & monitoring
- 🔑 Use proper secrets management (Railway Nexus, AWS Secrets Manager, etc.)

## 📚 Learning Resources

- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Uvicorn Docs](https://www.uvicorn.org)
- [Pydantic Docs](https://docs.pydantic.dev)
- [CORS in FastAPI](https://fastapi.tiangolo.com/tutorial/cors/)

## 🤝 Contributing

Improvements welcome! Common next steps:

- Add PostgreSQL database integration
- Implement authentication & authorization
- Add request validation & error handling
- Create automated tests (pytest)
- Add API rate limiting
- Implement caching (Redis)

## 📄 License

MIT © 2026
