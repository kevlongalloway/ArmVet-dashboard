# Deploying ArmVet Dashboard on Render

This guide covers deploying the ArmVet Dashboard (React + Vite) to [Render](https://render.com) as a static site.

---

## Prerequisites

- A [Render account](https://dashboard.render.com/register)
- This repository pushed to GitHub (or GitLab)

---

## Option 1 — Deploy via render.yaml (Recommended)

The repo includes a `render.yaml` file that configures everything automatically.

1. **Push this repo to GitHub** (if not already done).

2. **Go to the Render dashboard** → click **New** → **Blueprint**.

3. **Connect your GitHub account** and select the `ArmVet-dashboard` repository.

4. Render will detect `render.yaml` and configure the static site automatically.

5. Click **Apply** — Render will build and deploy.

6. Your dashboard will be live at a URL like `https://armvet-dashboard.onrender.com`.

---

## Option 2 — Manual Setup via Render Dashboard

### Step 1 — Create a new Static Site

1. Log in to [Render](https://dashboard.render.com).
2. Click **New** → **Static Site**.
3. Connect your GitHub/GitLab account and select the `ArmVet-dashboard` repository.

### Step 2 — Configure Build Settings

| Setting | Value |
|---|---|
| **Name** | `armvet-dashboard` (or your preferred name) |
| **Branch** | `main` (or `master`) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### Step 3 — Add Rewrite Rule (SPA routing)

Under **Redirects/Rewrites**, add:

| Source | Destination | Action |
|---|---|---|
| `/*` | `/index.html` | Rewrite |

This ensures direct URL access and page refreshes work correctly.

### Step 4 — Deploy

Click **Create Static Site**. Render will:
1. Clone the repository
2. Run `npm install && npm run build`
3. Serve the contents of `dist/` as a static site

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Project Structure

```
ArmVet-dashboard/
├── armvet-dashboard.jsx   # Main React dashboard component (dummy data — wire up later)
├── src/
│   └── main.jsx           # React entry point
├── index.html             # Vite HTML template
├── index-standalone.html  # Standalone vanilla JS version (no build required)
├── package.json
├── vite.config.js
├── render.yaml            # Render blueprint config
└── .gitignore
```

---

## Demo Credentials

The dashboard currently uses dummy data. Log in with:

- **Username:** `admin`
- **Password:** `armvet2026`

---

## Notes

- All booking and contact data is currently hardcoded dummy data. Live data integration will be wired up in a future update.
- The `index-standalone.html` file is a self-contained vanilla JS version that requires no build step — it can be opened directly in a browser.
- To add environment variables (e.g., for a future API key), go to **Render Dashboard → Your Service → Environment**.
