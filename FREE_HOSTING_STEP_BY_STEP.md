# 100% Free Cloud Deployment Guide for Feedants

This guide walks you through deploying the Feedants Full-Stack Competition application entirely on **free server tiers** without spending a single dollar or requiring a credit card.

---

## 🌐 Instant Live Public URL (Available Right Now)

Your local production server is already tunneled and live on the internet:

- **Live URL:** [https://early-spoons-cover.loca.lt](https://early-spoons-cover.loca.lt)
- **Tunnel Password / IP:** `103.181.54.59`
*(When opening the link, simply paste `103.181.54.59` and click "Click to Submit" to view the live app on any phone, tablet, or computer).*

---

## 🚀 Permanent Free Hosting Setup (Render + MongoDB Atlas)

This combination is the gold standard for full-stack Node.js + React applications because both provide generous, 100% free forever tiers.

### Step 1: Get Free Cloud MongoDB (MongoDB Atlas M0)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas/database) and sign up for free.
2. Click **Create Deployment** and select the **M0 Shared Cluster (FREE)**.
3. Under **Security Quickstart**:
   - Create a database user (e.g., `feedants_admin` and set a password).
   - Under **Network Access**, click **Add IP Address** -> Select **Allow Access from Anywhere (`0.0.0.0/0`)**.
4. Click **Connect** -> **Drivers** (Node.js) -> Copy the connection string:
   ```text
   mongodb+srv://feedants_admin:<your-password>@cluster0.abcde.mongodb.net/feedants?retryWrites=true&w=majority
   ```

---

### Step 2: Push Your Code to GitHub
Your local project directory is already initialized as a Git repository and committed! All you need to do is push it to your GitHub account:

```bash
# 1. Create a new repository on https://github.com/new named 'feedants-competition'
# 2. In your terminal, run:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/feedants-competition.git
git branch -M main
git push -u origin main
```

---

### Step 3: Deploy to Render.com (100% Free)
1. Go to [render.com](https://render.com) and log in with your GitHub account.
2. Click **New +** in the top navigation and select **Web Service**.
3. Select your `feedants-competition` repository from the list.
4. Render will automatically read `render.yaml` or you can configure:
   - **Name:** `feedants-competition`
   - **Region:** Any (e.g., Oregon or Singapore)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free` (0.1 CPU, 512 MB RAM, 750 free hours/month)
5. Scroll down to **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | `mongodb+srv://feedants_admin:<password>@cluster0...` |
   | `JWT_ACCESS_SECRET` | `feedants_access_secret_production_2026` |
   | `JWT_REFRESH_SECRET` | `feedants_refresh_secret_production_2026` |
   | `ALLOWED_ORIGINS` | `*` |

6. Click **Deploy Web Service**!

Render will automatically build the frontend web bundle and launch the server. Within ~2 minutes, your application will be live at:
```text
https://feedants-competition.onrender.com
```

---

## ⚡ Alternative Free Deployments

### Option B: Koyeb (100% Free Forever, No Sleep Mode)
- **Koyeb Free Tier** gives 1 free Nano service without the 15-minute sleep cycle of Render.
- Simply connect GitHub -> select Node.js -> build command `npm run build`, run command `npm start`.

### Option C: Vercel (Frontend) + Render (Backend)
If you prefer hosting the frontend on Vercel's global CDN:
1. Import `frontend` into [Vercel](https://vercel.com).
2. Framework Preset: `Other`, Build Command: `npx expo export --platform web`, Output Directory: `dist`.
3. Set Environment Variable: `EXPO_PUBLIC_API_URL=https://your-backend.onrender.com/api`.
4. Deploy!
