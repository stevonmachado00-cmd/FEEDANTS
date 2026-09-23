# Feedants Competition Details — Full-Stack Module

A full-stack, production-ready implementation of the **Feedants Competition Details Screen** built for the Full Stack Development Internship assignment.

![Feedants Mobile Screen Preview](/.user_uploaded/media_1790169202182.png)

---

## 🚀 Tech Stack

- **Frontend:** React Native (Expo SDK 52), Redux Toolkit, React Navigation v6, Reanimated, Expo Secure Store, Expo Clipboard.
- **Backend:** Node.js (v20+), Express.js, MongoDB (Mongoose), Socket.IO.
- **Security & Reliability:** JWT Authentication, bcryptjs (12 salt rounds), Helmet, Express Rate Limit, Express Mongo Sanitize (NoSQL injection guard), xss-clean, CORS whitelist.

---

## 📁 Project Architecture

```
feedants-competition/
├── backend/
│   ├── config/
│   │   ├── db.js                     # MongoDB connection
│   │   └── jwt.js                    # JWT secret & token configuration
│   ├── controllers/
│   │   ├── authController.js         # Signup, login, token refresh, logout
│   │   ├── competitionController.js  # Competition retrieval & lifecycle status
│   │   ├── registrationController.js # Concurrency-safe atomic registration
│   │   └── submissionController.js   # File/link submission & management
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification route guard
│   │   ├── errorHandler.js           # Centralized exception handler
│   │   ├── rateLimiter.js            # General & auth brute-force limiters
│   │   ├── securityMiddleware.js     # Helmet, CORS, input sanitization
│   │   ├── upload.js                 # Multer file upload handler
│   │   └── validateRequest.js        # Request schema validation
│   ├── models/
│   │   ├── Competition.js            # Competition schema + remainingSpots virtual
│   │   ├── Registration.js           # Registration schema with unique index
│   │   ├── Submission.js             # User submissions schema
│   │   └── User.js                   # User auth & referral code generation
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── competitionRoutes.js
│   │   ├── registrationRoutes.js
│   │   └── submissionRoutes.js
│   ├── seed/
│   │   └── seedData.js               # Database seeder matching the exact design
│   ├── .env.example
│   ├── package.json
│   └── server.js                      # Express & Socket.io server entry
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── competitionApi.js      # Axios client with automatic token refresh
│   │   ├── components/
│   │   │   ├── Header.js              # Back button + ENG/हिंदी language toggle
│   │   │   ├── HeroCard.js            # Title, tags, prize pool, entry fee, badge
│   │   │   ├── SpotsProgressBar.js    # Live remaining spots & booking ratio
│   │   │   ├── JudgeCard.js           # Judge info & intro video trigger
│   │   │   ├── CountdownBanner.js     # Live countdown timer & Hurry up badge
│   │   │   ├── ImportantDates.js      # 2x2 timeline grid with dates & icons
│   │   │   ├── PreviousWinners.js     # Horizontal carousel with video play badges
│   │   │   ├── DetailsTabs.js         # About / Judging / Rules tabs with expander
│   │   │   ├── RewardsTable.js        # Tiered prize distribution & disclaimer
│   │   │   ├── TrustBadges.js         # Prize transfer video, refund & Razorpay
│   │   │   ├── ReferralBanner.js      # Referral URL, clipboard copy & share
│   │   │   ├── UserTestimonials.js    # Community feedback card
│   │   │   ├── AdBanner.js            # Ad placement outline
│   │   │   ├── StickyActionBar.js     # State-driven dynamic CTA button
│   │   │   ├── BottomNavBar.js        # 5-tab mobile navigation bar
│   │   │   ├── VideoModal.js          # Interactive video playback dialog
│   │   │   └── SubmissionModal.js     # Performance submission modal
│   │   ├── hooks/
│   │   │   └── useCountdown.js        # Real-time countdown timer hook
│   │   ├── navigation/
│   │   │   └── AppNavigator.js        # Stack navigation setup
│   │   ├── screens/
│   │   │   └── CompetitionDetailsScreen.js # Master screen unifying all modules
│   │   ├── store/
│   │   │   ├── index.js               # Redux store configuration
│   │   │   └── slices/
│   │   │       ├── competitionSlice.js
│   │   │       └── userSlice.js
│   │   └── utils/
│   │       ├── colors.js              # Design color palette constants
│   │       ├── fonts.js               # Typography scale
│   │       └── helpers.js             # Currency & date formatters
│   ├── App.js
│   ├── app.json
│   └── package.json
└── README.md
```

---

## 🛠️ Installation & Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   npm install
   ```
2. Configure `.env` file (a pre-configured `.env` is provided):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/feedants
   JWT_ACCESS_SECRET=feedants_access_secret_key_dev_2026
   JWT_REFRESH_SECRET=feedants_refresh_secret_key_dev_2026
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   ALLOWED_ORIGINS=http://localhost:19006,http://localhost:8081,http://localhost:3000
   ```
3. Seed the database with the initial competition data:
   ```bash
   npm run seed
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # or npm start
   ```

### 2. Frontend Setup
1. Open a second terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Expo development server:
   ```bash
   npx expo start
   ```
3. Press `w` to open in Web browser, or scan the QR code using the **Expo Go** mobile app on iOS/Android.

---

## 🧠 Key Technical Decisions

1. **Concurrency Safety & Atomic Spot Decrement:**
   To guarantee that spots never overbook even under concurrent load from thousands of users, registration uses MongoDB's atomic `findOneAndUpdate`:
   ```javascript
   const updatedCompetition = await Competition.findOneAndUpdate(
     { 
       _id: competitionId, 
       status: 'registration_open',
       $expr: { $lt: ['$bookedSpots', '$totalSpots'] }
     },
     { $inc: { bookedSpots: 1 } },
     { new: true }
   );
   ```
   If 20 users attempt to book the final spot simultaneously, only one operation succeeds at the database engine level, avoiding race conditions and duplicate allocations.

2. **State-Driven Sticky Action Bar:**
   The bottom action button is reactive:
   - **Not Registered & Spots Available:** `Register Now • ₹99`
   - **Registered & Window Open:** `Upload Submission` (with `✔ Registered` badge)
   - **Submission Completed:** `View / Edit Submission`
   - **Deadline Passed or Spots Full:** `Registration Closed` / `Registration Full`

3. **Multi-layer Security:**
   - Stateless JWT tokens with short-lived access tokens (15m) and rotating refresh tokens (7d).
   - Rate limiting to protect against DDoS and brute-force auth attempts.
   - Input sanitization against NoSQL query selector injections (`express-mongo-sanitize`) and XSS attacks.
   - Encrypted token storage on mobile devices using `expo-secure-store`.

4. **100% Interactivity Across All Options:**
   - **Language Switcher:** Toggles between `ENG` and `हिंदी`.
   - **Video Triggers:** Tapping the Judge's *"Intro Video"*, any Previous Winner's video badge, or the prize money explainer opens an interactive `VideoModal`.
   - **Referral Module:** Tapping *"Copy Link"* copies the custom referral URL to the system clipboard with instant UI feedback; tapping *"Refer Now"* opens the native mobile share sheet.
   - **Tabs:** Switch seamlessly between *About*, *Judging Parameters*, and *Rules & Eligibility*, with smooth *View more / View less* text expansion.
   - **Submission Flow:** Tapping *"Upload Submission"* opens a `SubmissionModal` with form fields, live input validation, and Redux sync.

---

## ⚖️ Trade-offs Considered

- **Expo Managed Workflow vs. Bare React Native:**
  We selected Expo with standard React Native primitives to allow immediate cross-platform execution (Web, iOS, and Android) for reviewing, while maintaining identical native UI quality.
- **Embedded Audio/Video Player vs. Custom Video Modal:**
  A lightweight modal with video streaming capability was integrated to avoid heavy native compilation dependencies during initial reviewer evaluation.
- **Local vs. Cloud Media Storage:**
  Multer stores uploads in a local `/uploads` directory for easy standalone testing. For production, this easily swaps with AWS S3 / Cloudinary using standard S3 presigned URLs.

---

## 🔮 Future Production Improvements

1. **Redis Caching Layer:** Add a Redis cache for competition metadata and high-frequency read requests (`GET /competitions/:id`) to reduce database load.
2. **Real-time Live Chat / Reactions:** Enable Feedants' signature *"Appreciate"* and *"Improve"* peer feedback reactions during live competition broadcasts.
3. **Automated Video Transcoding:** Process contestant video submissions via FFmpeg pipelines to generate adaptive bitrate streams (HLS/DASH).
4. **Push Notification Reminders:** Schedule push notifications 24 hours and 1 hour before the registration and submission deadlines via FCM / APNs.

---

## 🚀 Production Deployment Guide

The project is structured with a unified production architecture where the Express server serves both the compiled Expo web application and the REST API + WebSocket services on a single port.

### Option 1: Unified Single-Server Run (Render, Railway, Heroku, VPS)
1. Install dependencies and build the frontend bundle:
   ```bash
   npm run build
   ```
2. Start the unified production server:
   ```bash
   npm start
   ```
   *The server will start on port `5000` (or `process.env.PORT`) serving both the Single Page Application at `/` and the backend endpoints at `/api`.*

### Option 2: Containerized Deployment (Docker & Docker Compose)
Run the full stack along with MongoDB with a single command:
```bash
docker-compose up --build -d
```
Access the application at `http://localhost:5000`.

### Option 3: Cloud Blueprints Included
- **Render:** [`render.yaml`](file:///render.yaml) is pre-configured for zero-config 1-click web service deployment.
- **Railway / Heroku:** [`Procfile`](file:///Procfile) specifies the web worker process.
- **Vercel:** [`vercel.json`](file:///vercel.json) configured for static frontend export.

