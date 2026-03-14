const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const h = { 'Content-Type': 'application/json' };

export const api = {
  getRider: () => fetch(`${BASE}/rider/1`).then(r => r.json()),
  getWallet: () => fetch(`${BASE}/rider/1/wallet`).then(r => r.json()),
  getSavings: () =>
  fetch(`${BASE}/rider/1/wallet`)
    .then(r => r.json())
    .then(data => ({
      total_saved: data.total_saved,
      monthly_saved: data.monthly_saved,
      weekly_saved: 0,
      goal_progress: 0,
      goal_amount: 5000,
      streak: 0,
      xp: 0,
      level: "Starter",
      level_icon: "🥉",
      level_min: 0,
      level_max: 1000,
      total_rides: 0,
      saving_rides: 0
    })),

  getBadges: async () => {
  return [
    { name: "First Save", icon: "💰" },
    { name: "Consistent Saver", icon: "🔥" },
    { name: "Goal Builder", icon: "🎯" }
  ];
},

  getCommunity: () => fetch(`${BASE}/community/stats`).then(r => r.json()),

  receivePayment: (amount, customer_name) =>
    fetch(`${BASE}/rider/1/payment`, {
      method: 'POST', headers: h,
      body: JSON.stringify({ amount: parseFloat(amount), customer_name }),
    }).then(r => r.json()),

  processSave: (transaction_id, accept, amount) =>
    fetch(`${BASE}/rider/1/save`, {
      method: 'POST', headers: h,
      body: JSON.stringify({ transaction_id, accept, amount }),
    }).then(r => r.json()),
};
