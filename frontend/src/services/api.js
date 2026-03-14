const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const h = { 'Content-Type': 'application/json' };

export const api = {
  getRider: () => fetch(`${BASE}/rider/1`).then(r => r.json()),
  getWallet: () => fetch(`${BASE}/rider/1/wallet`).then(r => r.json()),
  getSavings: () => fetch(`${BASE}/rider/1/savings`).then(r => r.json()),
  getBadges: () => fetch(`${BASE}/rider/1/badges`).then(r => r.json()),
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
