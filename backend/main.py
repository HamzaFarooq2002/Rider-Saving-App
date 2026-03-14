from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import random
import os

app = FastAPI(title="Rider Bachat API", version="1.0.0")

# Configure CORS with environment variables
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# ── In-memory data store ───────────────────────────────────────────────────────

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
    {"id": 1, "amount": 350.0, "customer": "Fatima A.", "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(), "saved": 10.5, "status": "saved"},
    {"id": 2, "amount": 220.0, "customer": "Ali H.", "timestamp": (datetime.now() - timedelta(hours=3)).isoformat(), "saved": 6.6, "status": "saved"},
    {"id": 3, "amount": 180.0, "customer": "Zara M.", "timestamp": (datetime.now() - timedelta(hours=6)).isoformat(), "saved": 0, "status": "skipped"},
    {"id": 4, "amount": 450.0, "customer": "Usman R.", "timestamp": (datetime.now() - timedelta(hours=26)).isoformat(), "saved": 13.5, "status": "saved"},
    {"id": 5, "amount": 120.0, "customer": "Sana B.", "timestamp": (datetime.now() - timedelta(hours=28)).isoformat(), "saved": 3.6, "status": "saved"},
    {"id": 6, "amount": 280.0, "customer": "Bilal T.", "timestamp": (datetime.now() - timedelta(hours=30)).isoformat(), "saved": 8.4, "status": "saved"},
    {"id": 7, "amount": 90.0, "customer": "Aisha K.", "timestamp": (datetime.now() - timedelta(days=2)).isoformat(), "saved": 0, "status": "skipped"},
    {"id": 8, "amount": 500.0, "customer": "Omar S.", "timestamp": (datetime.now() - timedelta(days=2, hours=4)).isoformat(), "saved": 15.0, "status": "saved"},
]

community_db = {
    "total_riders_saving": 12847,
    "today_joined": 234,
    "total_community_saved": 18500000,
}

_next_id = 9

# ── Level system ──────────────────────────────────────────────────────────────

LEVELS = [
    {"name": "Bronze Saver", "icon": "🥉", "min": 0,    "max": 500,  "color": "#CD7F32"},
    {"name": "Silver Saver", "icon": "🥈", "min": 500,  "max": 1000, "color": "#C0C0C0"},
    {"name": "Gold Saver",   "icon": "🥇", "min": 1000, "max": 2000, "color": "#FFD700"},
    {"name": "Platinum",     "icon": "💎", "min": 2000, "max": 5000, "color": "#E5E4E2"},
]

def get_level(xp: int) -> dict:
    for lvl in LEVELS:
        if xp < lvl["max"]:
            return lvl
    return LEVELS[-1]

# ── Models ────────────────────────────────────────────────────────────────────

class PaymentRequest(BaseModel):
    amount: float
    customer_name: str

class SaveDecision(BaseModel):
    transaction_id: int
    accept: bool
    amount: float

# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Rider Bachat API 🚀", "status": "running"}

@app.get("/rider/{rider_id}")
def get_rider(rider_id: int):
    lvl = get_level(rider_db["xp"])
    return {
        **rider_db,
        "level": lvl["name"],
        "level_icon": lvl["icon"],
        "level_color": lvl["color"],
        "level_min": lvl["min"],
        "level_max": lvl["max"],
        "goal_progress": round((rider_db["total_saved"] / rider_db["goal_amount"]) * 100, 1),
    }

@app.get("/rider/{rider_id}/wallet")
def get_wallet(rider_id: int):
    txns = sorted(transactions_db, key=lambda x: x["timestamp"], reverse=True)[:10]
    return {
        "balance": rider_db["balance"],
        "total_saved": rider_db["total_saved"],
        "monthly_saved": rider_db["monthly_saved"],
        "transactions": txns,
    }

@app.post("/rider/{rider_id}/payment")
def receive_payment(rider_id: int, payment: PaymentRequest):
    global _next_id
    save_amount = round(payment.amount * rider_db["saving_rate"], 2)

    tx = {
        "id": _next_id,
        "amount": payment.amount,
        "customer": payment.customer_name,
        "timestamp": datetime.now().isoformat(),
        "saved": 0,
        "status": "pending",
        "pending_save": save_amount,
    }
    _next_id += 1
    transactions_db.insert(0, tx)
    rider_db["balance"] += payment.amount
    rider_db["total_rides"] += 1

    return {
        "transaction": tx,
        "save_suggestion": save_amount,
        "new_balance": rider_db["balance"],
        "percentage": int(rider_db["saving_rate"] * 100),
        "message": f"Save just Rs.{save_amount} to grow your Bachat fund!",
    }

@app.post("/rider/{rider_id}/save")
def process_save(rider_id: int, decision: SaveDecision):
    if decision.accept:
        rider_db["balance"] -= decision.amount
        rider_db["total_saved"] += decision.amount
        rider_db["monthly_saved"] += decision.amount

        xp_earned = max(10, int(decision.amount / 3))
        rider_db["xp"] += xp_earned

        for tx in transactions_db:
            if tx["id"] == decision.transaction_id:
                tx["saved"] = decision.amount
                tx["status"] = "saved"
                tx.pop("pending_save", None)
                break

        lvl = get_level(rider_db["xp"])
        return {
            "success": True,
            "new_balance": rider_db["balance"],
            "new_savings": rider_db["total_saved"],
            "xp_earned": xp_earned,
            "total_xp": rider_db["xp"],
            "level": lvl["name"],
            "level_icon": lvl["icon"],
        }
    else:
        for tx in transactions_db:
            if tx["id"] == decision.transaction_id:
                tx["status"] = "skipped"
                tx.pop("pending_save", None)
                break
        return {"success": False, "message": "You can save next time!"}

@app.get("/rider/{rider_id}/savings")
def get_savings(rider_id: int):
    lvl = get_level(rider_db["xp"])
    one_week_ago = datetime.now() - timedelta(days=7)
    weekly_saved = sum(
        tx["saved"] for tx in transactions_db
        if tx["saved"] > 0 and datetime.fromisoformat(tx["timestamp"]) > one_week_ago
    )
    saving_rides = len([tx for tx in transactions_db if tx.get("saved", 0) > 0])

    return {
        "total_saved": rider_db["total_saved"],
        "monthly_saved": rider_db["monthly_saved"],
        "weekly_saved": round(weekly_saved, 2),
        "goal_amount": rider_db["goal_amount"],
        "goal_progress": round((rider_db["total_saved"] / rider_db["goal_amount"]) * 100, 1),
        "streak": rider_db["streak"],
        "level": lvl["name"],
        "level_icon": lvl["icon"],
        "level_color": lvl["color"],
        "level_min": lvl["min"],
        "level_max": lvl["max"],
        "xp": rider_db["xp"],
        "total_rides": rider_db["total_rides"],
        "saving_rides": saving_rides,
    }

@app.get("/rider/{rider_id}/badges")
def get_badges(rider_id: int):
    earned = rider_db["badges"]
    total_saved = rider_db["total_saved"]
    return [
        {"id": "first_save",    "name": "First Step",      "desc": "Made your very first save!",          "icon": "🎯", "rarity": "Common",    "earned": "first_save" in earned},
        {"id": "streak_7",      "name": "7-Day Warrior",   "desc": "Saved 7 days in a row!",              "icon": "🔥", "rarity": "Rare",      "earned": "streak_7" in earned},
        {"id": "community_star","name": "Community Star",  "desc": "Part of 10,000+ riders saving!",      "icon": "⭐", "rarity": "Uncommon",  "earned": "community_star" in earned},
        {"id": "savings_500",   "name": "Half-K Hero",     "desc": "Saved ₹500 total!",                   "icon": "💸", "rarity": "Common",    "earned": total_saved >= 500},
        {"id": "savings_2000",  "name": "Savings Pro",     "desc": "Saved ₹2,000 total!",                 "icon": "💰", "rarity": "Rare",      "earned": "savings_2000" in earned},
        {"id": "goal_complete", "name": "Goal Crusher",    "desc": "Completed your savings goal!",        "icon": "🏆", "rarity": "Legendary", "earned": total_saved >= rider_db["goal_amount"]},
    ]

@app.get("/community/stats")
def get_community_stats():
    community_db["total_riders_saving"] += random.randint(0, 2)
    return community_db
