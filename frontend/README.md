# Frontend: Rider Bachat

React + Vite-powered dashboard for the Rider Bachat savings app.

## 🎨 Features

- **Responsive UI** — Works on mobile, tablet, desktop
- **Real-time Dashboard** — Live updates of savings, XP, levels
- **Gamification UI** — Badge grid, progress rings, XP toasts
- **Auto-Save Modal** — Bottom-sheet notification for save decisions

## 🛠️ Tech Stack

- **React 19** — UI components
- **Vite** — Lightning-fast build & HMR
- **CSS3** — Responsive styling (no frameworks)
- **ESLint** — Code quality

## 📂 Structure

\\\
src/
├── components/
│   ├── AutoSaveModal.jsx     # Save decision popup
│   ├── BadgeGrid.jsx          # Achievement badges display
│   ├── GoalRing.jsx           # SVG progress ring
│   ├── Navbar.jsx             # Top navigation
│   └── ...
├── pages/
│   ├── SavingsPage.jsx        # Main dashboard (Bachat tab)
│   ├── WalletPage.jsx         # Balance & history (Wallet tab)
│   └── ...
├── services/
│   └── api.js                 # API client for backend calls
├── App.jsx                    # Main app wrapper
└── index.css                  # Global styles
\\\

## 🚀 Getting Started

### Install Dependencies
\\\ash
npm install
\\\

### Development Server
\\\ash
npm run dev
\\\
Visit \http://localhost:5173\ — Vite's HMR will auto-reload changes.

### Build for Production
\\\ash
npm run build
\\\
Output goes to \dist/\ folder.

### Linting
\\\ash
npm run lint
\\\

### Preview Production Build
\\\ash
npm run preview
\\\

## 🔌 API Configuration

The frontend expects a backend API at \http://localhost:8000\ by default.

To change the API URL:
1. Create \.env.local\ in the frontend folder:
   \\\
   VITE_API_URL=https://your-api-url
   \\\
2. The API client in \src/services/api.js\ will use this URL:
   \\\javascript
   const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
   \\\

## 📦 Environment Variables

Create \.env.local\ file (not tracked by git):
\\\
# Required for production deployment
VITE_API_URL=https://your-backend-url.railway.app
\\\

See \.env.example\ for all available options.

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect GitHub Repository**
   - Push code to GitHub
   - Go to vercel.com → Import Project
   - Select \ider-bachat\ repository
   - Configure root directory: \rontend/\

2. **Set Environment Variables**
   - In Vercel Project Settings → Environment Variables
   - Add: \VITE_API_URL=https://your-backend-url.railway.app\

3. **Deploy**
   - Vercel will auto-build and deploy on every push to \main\ branch
   - Your site will be live at \your-project.vercel.app\

4. **Custom Domain**
   - In Vercel → Domains
   - Add your custom domain and follow DNS setup instructions

### Other Options

- **Netlify:** Similar to Vercel, import GitHub repo and configure build
- **Static Host:** Run \
pm run build\ and deploy \dist/\ folder to any static host (GitHub Pages, AWS S3, etc.)

## 🎯 Available Scripts

| Script | Purpose |
|--------|---------|
| \
pm run dev\ | Start dev server (port 5173) |
| \
pm run build\ | Build for production → \dist/\ |
| \
pm run preview\ | Preview production build locally |
| \
pm run lint\ | Check code quality with ESLint |

## 🔍 Troubleshooting

### "Cannot GET /rider/1"
- Backend is not running or incorrect API URL
- Check \VITE_API_URL\ environment variable
- Verify backend is running on correct port

### CORS Errors in Browser Console
- Backend CORS settings are too restrictive
- Check \.env\ in backend, \ALLOWED_ORIGINS\ should include frontend URL
- During development, backend defaults to \http://localhost:5173\

### Hot Module Reload (HMR) Not Working
- Vite might be serving from wrong host
- Check browser DevTools → Network tab
- Try clearing browser cache and restarting dev server

## 📚 Learning Resources

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [CSS3 Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## 🤝 Contributing

Improvements & bug fixes welcome! Common areas for contribution:
- Additional UI components (charts, animations)
- Performance optimizations
- Accessibility improvements (ARIA labels, keyboard navigation)
- Mobile responsiveness enhancements

## 📄 License

MIT © 2026
