# Rider Bachat — Product Requirements Document

## Problem Statement

Rider income is volatile and is usually immediately consumed,
leaving no funds for emergencies like bike repairs or petrol price increases.

## Solution

A feature that saves small amounts from each ride into a savings fund based on the rider's consent.
Tracking of these savings and **behavioral UX gamification** will be included.
These savings can later be used for insurance and investments.

---

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: FastAPI (Python)

---

## Core Features

### 1. Rider Wallet
- Integrated with rider bank / EMI account
- Displays current balance
- Balance is updated when a payment from a customer is received
- Shows full history of customer payments with amounts and timestamps

### 2. Auto-Save Rule Notification (3% Rule)
- When a rider receives a payment, a popup (bottom sheet) is shown
- Rider is prompted to save 3% of the payment amount
- Example:
  - Ride payment = ₹1,000
  - Save suggestion = ₹30 (3%)
  - If accepted → Balance = ₹970, Savings = ₹30
  - If declined → Balance = ₹1,000, Savings unchanged
- XP is earned when rider saves

### 3. Savings Dashboard (Bachat Tab)
A gamified dashboard with the following metrics and elements:

#### Metrics
| Metric          | Description                              |
|-----------------|------------------------------------------|
| Total Saved     | Cumulative savings across all rides      |
| Monthly Savings | Savings in the current calendar month   |
| Weekly Savings  | Savings in the last 7 days               |
| Goal Progress   | % progress toward an emergency fund goal |

#### Gamification Features
- **Community Counter** — total number of other riders who are also saving ("12,847 riders saving like you!")
- **Daily Joiners** — "+234 joined today" social proof nudge
- **Goal Ring** — circular SVG progress ring for the savings goal (default: ₹5,000 emergency fund)
- **Streak Counter** — consecutive days of saving (with animated 🔥 flame)
- **XP System** — riders earn XP for every save; XP unlocks levels
- **Level System** — Bronze → Silver → Gold → Platinum Saver
- **Achievement Badges** — First Step, 7-Day Warrior, Community Star, Half-K Hero, Savings Pro, Goal Crusher
- **XP Toast** — animated "+XX XP earned!" notification after each save

---

## API Endpoints

| Method | Endpoint                    | Description                         |
|--------|-----------------------------|-------------------------------------|
| GET    | `/rider/{id}`               | Rider profile with level & XP        |
| GET    | `/rider/{id}/wallet`        | Balance + transaction history        |
| POST   | `/rider/{id}/payment`       | Simulate incoming customer payment   |
| POST   | `/rider/{id}/save`          | Process save/skip decision           |
| GET    | `/rider/{id}/savings`       | Full savings dashboard data          |
| GET    | `/rider/{id}/badges`        | Earned/locked achievement badges     |
| GET    | `/community/stats`          | Total riders saving + daily joiners  |
