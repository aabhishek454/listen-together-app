# Abhishek ❤️ Radhika - Listen Together

A premium, private web app for 2 users to listen to music together in real-time.

## Features
- **Free Search**: No YouTube API key required (uses `yt-search`).
- **Real-time Sync**: Play/Pause/Seek sync for both users.
- **Sweet Chat**: Private chat with glassmorphism UI.
- **Premium Design**: Dark mode, gradients, and animated hearts.

## One-Click Deployment 🚀

Click the buttons below to deploy your own private version:

### 1. Deploy Backend (Render)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
*Note: Link your GitHub repository to Render and point it to the `server` directory.*

### 2. Deploy Frontend (Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)
*Note: Link your GitHub repository to Vercel and point it to the `client` directory.*

---

## Local Setup

### Backend (Server)
1. `cd server`
2. `npm install`
3. `npm start` (Runs on port 5000)

### Frontend (Client)
1. `cd client`
2. `npm install`
3. `npm run dev`

---

## Technical Details
- **Frontend**: Vite + React + Tailwind CSS
- **Backend**: Node.js + Express + Socket.io + yt-search
- **Sync**: 2-second control lock for smooth experience.
