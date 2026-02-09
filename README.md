# 🔥 Griva Reads — The Unchosen Path Challenge

A Gothic-themed creative writing competition site where students submit alternative endings to your story. Submissions are collected and compiled into a downloadable Word document.

---

## Pages

| Page | URL | Description |
|------|-----|-------------|
| **Poster + Form** | `/` | The competition poster and student submission form |
| **Admin Panel** | `/admin` | View all submissions and download the Word document |

---

## Deploying to Vercel

### Step 1: Push to GitHub

1. Create a new GitHub repository (e.g. `griva-reads-challenge`)
2. Push this project folder to it:
   ```bash
   cd griva-reads-challenge
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/griva-reads-challenge.git
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `griva-reads-challenge` repository
4. Click **Deploy** — Vercel will automatically detect it's a Next.js project

### Step 3: Add Vercel KV (Database for Submissions)

This is where student submissions are stored. It's free on the Hobby plan.

1. In your Vercel dashboard, go to your project
2. Click the **"Storage"** tab
3. Click **"Create Database"** → choose **"KV"**
4. Give it a name (e.g. `griva-submissions`)
5. Click **"Create"**
6. Vercel will automatically add the required environment variables (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc.)
7. **Redeploy** your project: go to **Deployments** → click the `...` menu on the latest → **Redeploy**

### Step 4: Set Admin Password (Optional)

By default, the admin password is `grivareads2025`. To change it:

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add a new variable:
   - **Key:** `ADMIN_PASSWORD`
   - **Value:** your chosen password
3. Redeploy the project

---

## How It Works

### For Students
1. Students visit the site and see the competition poster
2. They scroll down to the form
3. They fill in their name, form class, and write their alternative ending (max 250 words)
4. Spellcheck works natively in the browser
5. They click submit — done!

### For You (Admin)
1. Go to `yoursite.vercel.app/admin`
2. Enter the admin password
3. See all submissions listed with names, form classes, word counts, and dates
4. Click **"Download Word Document"** — this generates a beautifully formatted `.docx` with all submissions compiled into one document
5. Each time you download, it includes the latest submissions

---

## Customisation

- **Word limit**: Change `250` in `pages/index.js` (search for `250`)
- **Admin password**: Set `ADMIN_PASSWORD` environment variable in Vercel
- **Poster text**: Edit the JSX in `pages/index.js`
- **Form styling**: Edit `styles/globals.css`
