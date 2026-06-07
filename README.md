# KarachiFlow 🔴
**Real-Time Utility Crisis Reporter & Tracker for Karachi**

ZABEFEST Hackathon 2026 — Team: [Your Names]

---

## What it does
Citizens report load shedding and water crises → community verifies → authorities act → everyone sees live status.

**Features:**
- Citizen issue reporting (3-step form, offline-first with localStorage)
- Smart prioritization (vote score × recency → auto-escalate at 10+ votes)
- Crowdsourced verification ("I'm affected too" button)
- Zone heatmap (color-coded severity per Karachi neighborhood)
- Real-time live feed with filters
- Admin dashboard (resolve, escalate, add official updates + ETA)
- Urdu language toggle
- Browser push notification support

---

## Tech Stack
- **Frontend:** HTML, CSS, Vanilla JS
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **Hosting:** Render (free tier)

---

## Setup in 5 minutes

### 1. Install dependencies
```bash
cd karachiflow
npm install
```

### 2. MongoDB Atlas setup
1. Go to https://cloud.mongodb.com
2. Create free cluster → Connect → Get connection string
3. Copy `.env.example` to `.env` and paste your connection string

```bash
cp .env.example .env
# Edit .env with your MongoDB URI
```

### 3. Run locally
```bash
npm start
# Open http://localhost:3000
```

### 4. Deploy to Render
1. Push to GitHub
2. Go to render.com → New Web Service → Connect repo
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variable: `MONGO_URI` = your Atlas URI

---

## Pages
| Page | Route | Description |
|---|---|---|
| Home | `/` | Dashboard with stats + recent reports |
| Live Feed | `/feed` | All reports with filters |
| Zones | `/zones` | Heatmap of Karachi areas |
| Report | `/report` | Submit new report (3-step form) |
| Admin | `/admin` | Authority management panel |

## API Routes
| Method | Route | Description |
|---|---|---|
| GET | `/api/reports` | All active reports |
| GET | `/api/reports/zones` | Zone summary for heatmap |
| GET | `/api/reports/admin/all` | All reports (admin) |
| POST | `/api/reports` | Submit new report |
| PATCH | `/api/reports/:id/vote` | Confirm issue |
| PATCH | `/api/reports/:id/status` | Update status (admin) |

---

## Sustainability Components
- ✅ **Environmental:** Water shortage data helps KWSB optimize supply
- ✅ **Social:** Transparent public dashboard builds citizen trust
- ✅ **Economic:** Load shedding prediction helps businesses plan backup power
