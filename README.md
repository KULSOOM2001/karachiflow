# 🌊 KarachiFlow — Fix Karachi, One Report at a Time

<div align="center">

![ZABEFEST](https://img.shields.io/badge/ZABEFEST-Hackathon%202026-ff4d2e?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Real-Time Utility Crisis Tracker for Karachi**  
*Report. Verify. Fix.*

[Live Demo](https://karachiflow-production.up.railway.app) · [GitHub](https://github.com/KULSOOM2001/karachiflow)

</div>

---

## 🎯 The Problem

Every day, 20 million Karachiites face:

| Crisis | Reality |
|--------|---------|
| ⚡ Load Shedding | No schedule, no updates, hours of darkness |
| 💧 Water Shortage | No tracking, tanker mafia, helpless citizens |
| 🚛 Tanker Crisis | Bookings vanish, phones off, double pricing |

**Current System:** WhatsApp groups + word of mouth = Zero accountability, zero data, zero resolution.

---

## 💡 Our Solution

Citizens report load shedding and water crises → Community verifies → Authorities act → Everyone sees live status.

### Three Core Components:

| Component | Implementation | Impact |
|-----------|---------------|--------|
| 🌿 Environmental | Real-time water & power crisis tracking with zone analytics | Helps KWSB & KE optimize resource distribution |
| 👥 Social | Crowdsourced verification + public transparency dashboard | Builds citizen-authority trust, prevents fake reports |
| 💰 Economic | Smart prioritization + resolution time analytics | Businesses predict outages, plan backup power |

---

## ✨ Key Features

### 📝 Smart Reporting
- 3-step form (Issue Type → Location → Review)
- 20 Karachi zones mapped with dropdown
- Offline-first: Saves drafts in localStorage when internet cuts

### 👥 Crowdsourced Verification
- "I'm affected too" button on every report
- Unique voter ID per browser prevents duplicate votes
- 3+ confirmations = Auto-verified status
- 20+ confirmations = Critical emergency

### 🗺️ Zone Heatmap
- All 20 Karachi neighborhoods color-coded
- 🔴 Critical → 🟠 High → 🟡 Medium → 🟢 Low
- Click any zone for detailed reports

### ⚙️ Authority Dashboard
- Resolve, escalate, add official updates + ETA
- Delete fake/spam reports
- Live statistics: Total, Active, Escalated, Resolved

### 📊 Real-Time Live Feed
- All reports with severity color coding
- Filter by: Type (Load Shedding/Water/Tanker)
- Auto-refresh every 30 seconds

---

## 🎬 Live Demo

🌐 **URL:** [https://karachiflow-production.up.railway.app](https://karachiflow-production.up.railway.app)

**Try it yourself:**
1. Open the URL
2. Login as Citizen → Select your area → See real reports
3. Vote on issues → Watch them auto-verify
4. Login as Admin → Manage reports in real-time

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, Vanilla JS
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **Hosting:** Railway (free tier)

---

## 🚀 Setup in 5 Minutes

### 1. Install dependencies
```bash
cd karachiflow
npm install
```

### 2. Environment Setup
```bash
Create a `.env` file in the root directory with your MongoDB connection string and admin secret.
```

### 3. Run locally
```bash
npm start
# Open http://localhost:3000
```

### 4. Deploy to Railway
1. Push to GitHub
2. Go to railway.app → New Web Service → Connect repo
3. Build command: `npm install`
4. Start command: `node server.js`
5. dd the required environment variables in Railway dashboard.

---

## 📋 Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Dashboard with stats + recent reports |
| Live Feed | `/feed` | All reports with filters |
| Zones | `/zones` | Heatmap of Karachi areas |
| Report | `/report` | Submit new report (3-step form) |
| Admin | `/admin` | Authority management panel |

## 📋 API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/reports` | All active reports |
| GET | `/api/reports/zones` | Zone summary for heatmap |
| GET | `/api/reports/admin/all` | All reports (admin) |
| POST | `/api/reports` | Submit new report |
| PATCH | `/api/reports/:id/vote` | Confirm issue |
| PATCH | `/api/reports/:id/status` | Update status (admin) |
| DELETE | `/api/reports/:id` | Delete report |

---

## 🏆 Hackathon Requirements Met

### Mandatory Components (3/3)
- ✅ Environmental Sustainability
- ✅ Social Sustainability
- ✅ Economic Sustainability

### Challenge Components (8/12)
- ✅ Citizen Issue Reporting
- ✅ Location Intelligence (20 zones)
- ✅ Smart Prioritization
- ✅ Real-Time Alerts
- ✅ Public Transparency Dashboard
- ✅ Crowdsourced Verification
- ✅ Emergency Escalation
- ✅ Authority/Admin Workflow

### Mandatory Constraints (6/6)
- ✅ Works on low-end devices (Vanilla JS)
- ✅ Offline-first functionality
- ✅ Scalable cloud architecture
- ✅ Data authenticity (3+ community verification)
- ✅ User privacy (anonymous reporting option)
- ✅ Fake report prevention (unique voter ID + admin moderation)

---

## 🔮 Future Roadmap

- [ ] Machine Learning: Predict outage patterns
- [ ] SMS Integration: Report via SMS
- [ ] WhatsApp Bot: Submit reports from WhatsApp
- [ ] K-Electric API: Direct utility integration
- [ ] Mobile App: React Native for iOS & Android

---
