from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import random
import os

app = FastAPI(
    title="Rider Bachat API",
    version="1.0.0",
    description="Backend API for Rider Bachat savings platform"
)

# ─────────────────────────────────────────
# CORS Configuration (Fix for Vercel)
# ─────────────────────────────────────────

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")

# Allow all origins in production if needed
if os.getenv("ENV") == "production":
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────
# In-Memory Data Store
# ─────────────────────────────────────────

rider_db = {
    "id": 1,
    "name": "Ahmed Khan",
    "phone": "+92 300 1234567",
    "avatar": "AK",
    "xp": 450,
    "streak": 7,
    "balance": 4850.00,
    "total_saved": 2340.00,
    "monthly_saved": 580.00,
    "goal_amount": 5000.00,
    "badges": ["first_save", "streak_7", "community_star", "savings_2000"],
    "total_rides": 83,
    "saving_rate": 0.03,
}

transactions_db = [
    {
        "id": 1,
        "amount": 350.0,
        "customer": "Fatima A.",
        "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(),
        "saved": 10.5,
        "status": "saved"
    }
]

community_db = {
    "total_riders_saving": 12847,
    "today_joined": 234,
    "total_community_saved": 18500000,
}

_next_id = 2

# ─────────────────────────────────────────
# Level System
# ─────────────────────────────────────────

LEVELS = [
    {"name": "Bronze Saver", "icon": "🥉", "min": 0, "max": 500},
    {"name": "Silver Saver", "icon": "🥈", "min": 500, "max": 1000},
    {"name": "Gold Saver", "icon": "🥇", "min": 1000, "max": 2000},
    {"name": "Platinum", "icon": "💎", "min": 2000, "max": 5000},
]


def get_level(xp: int):
    for level in LEVELS:
        if xp < level["max"]:
            return level
    return LEVELS[-1]


# ─────────────────────────────────────────
# Request Models
# ─────────────────────────────────────────

class PaymentRequest(BaseModel):
    amount: float
    customer_name: str


class SaveDecision(BaseModel):
    transaction_id: int
    accept: bool
    amount: float


# ─────────────────────────────────────────
# Routes
# ─────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "running", "service": "Rider Bachat API"}


@app.get("/rider/{rider_id}")
def get_rider(rider_id: int):
    level = get_level(rider_db["xp"])

    return {
        **rider_db,
        "level": level["name"],
        "level_icon": level["icon"],
        "goal_progress": round(
            (rider_db["total_saved"] / rider_db["goal_amount"]) * 100, 1
        ),
    }


@app.get("/rider/{rider_id}/wallet")
def get_wallet(rider_id: int):

    transactions = sorted(
        transactions_db,
        key=lambda x: x["timestamp"],
        reverse=True
    )[:10]

    return {
        "balance": rider_db["balance"],
        "total_saved": rider_db["total_saved"],
        "monthly_saved": rider_db["monthly_saved"],
        "transactions": transactions,
    }


@app.post("/rider/{rider_id}/payment")
def receive_payment(rider_id: int, payment: PaymentRequest):

    global _next_id

    save_amount = round(payment.amount * rider_db["saving_rate"], 2)

    transaction = {
        "id": _next_id,
        "amount": payment.amount,
        "customer": payment.customer_name,
        "timestamp": datetime.now().isoformat(),
        "saved": 0,
        "status": "pending",
        "pending_save": save_amount,
    }

    _next_id += 1
    transactions_db.insert(0, transaction)

    rider_db["balance"] += payment.amount
    rider_db["total_rides"] += 1

    return {
        "transaction": transaction,
        "save_suggestion": save_amount,
        "new_balance": rider_db["balance"],
        "message": f"Save Rs.{save_amount} to grow your Bachat fund!",
    }


@app.post("/rider/{rider_id}/save")
def process_save(rider_id: int, decision: SaveDecision):

    if decision.accept:

        rider_db["balance"] -= decision.amount
        rider_db["total_saved"] += decision.amount
        rider_db["monthly_saved"] += decision.amount

        xp = max(10, int(decision.amount / 3))
        rider_db["xp"] += xp

        for tx in transactions_db:
            if tx["id"] == decision.transaction_id:
                tx["saved"] = decision.amount
                tx["status"] = "saved"
                tx.pop("pending_save", None)
                break

        level = get_level(rider_db["xp"])

        return {
            "success": True,
            "xp_earned": xp,
            "total_xp": rider_db["xp"],
            "level": level["name"],
        }

    for tx in transactions_db:
        if tx["id"] == decision.transaction_id:
            tx["status"] = "skipped"
            tx.pop("pending_save", None)
            break

    return {"success": False, "message": "Save skipped."}


@app.get("/community/stats")
def get_community_stats():

    community_db["total_riders_saving"] += random.randint(0, 2)

    return community_db


# ─────────────────────────────────────────
# Railway Compatibility
# ─────────────────────────────────────────

if __name__ == "__main__":

    import uvicorn

    port = int(os.environ.get("PORT", 8000))

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False
    )
