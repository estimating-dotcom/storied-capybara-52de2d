# LionStone Floors - Complete Project & Developer Handoff Guide

Welcome to the **LionStone Floors** website repository. This document contains all the necessary instructions, architecture details, deployment procedures, and configurations to run, edit, and maintain this project on a new computer.

---

## 📌 1. Project Overview

- **Live Production URL:** [https://lionstonefloors.com/](https://lionstonefloors.com/)
- **Hosting Platform:** Netlify (Site ID: `storied-capybara-52de2d.netlify.app`)
- **Technology Stack:** Static HTML5, Vanilla CSS3 (Custom Design System in `assets/css/customstyle.css`), Vanilla JavaScript, localized web assets.
- **Key Business Information:**
  - **Company:** LionStone Concrete Coating LLC
  - **Phone:** `(860) 805-0061`
  - **Email:** `estimating@lionstonefloors.com`
  - **Service Region:** Massachusetts & Connecticut
  - **Headquarters:** 12 Bartlett Court, Wilbraham, MA 01095

---

## 💻 2. Getting Started on a New Machine

### Prerequisites
1. **Python 3.8+** (Installed and added to your system `PATH`).
2. **Modern Web Browser** (Google Chrome, Edge, Safari, or Firefox).
3. *(Optional)* **Node.js / npm** (if using Netlify CLI for CLI deployments).
4. *(Optional)* **Code Editor** (e.g., VS Code, Cursor, or Sublime Text).

---

### Step-by-Step Setup

1. **Extract / Clone the Files:**
   Place the project folder in your desired workspace directory (e.g., `C:\Projects\lionstonefloors` or `~/projects/lionstonefloors`).

2. **Directory Structure:**
   ```text
   lionstone-local-sandbox/
   ├── index.html                  # Homepage
   ├── about-us.html               # About Us & Company Info
   ├── services.html               # All Concrete & Flooring Services
   ├── contact.html                # Contact Page, Service Areas & Maps
   ├── reviews.html                # Reviews & Inspiration Gallery
   ├── README.md                   # This handoff documentation
   ├── start_server.ps1            # Windows PowerShell server launcher
   ├── assets/
   │   ├── css/
   │   │   ├── customstyle.css     # Primary stylesheet for custom overrides & branding
   │   │   └── ... (theme & elementor localized stylesheets)
   │   ├── fonts/                  # Localized webfonts (Cardo, Inter, Woodmart icons)
   │   ├── images/                 # All high-res photos, icons, and textures
   │   └── js/
   │       ├── form_handler.js     # Form interception, financing auto-scroll & modals
   │       └── ... (script dependencies)
   └── (Utility & QA Scripts)
       ├── capture_pages.py        # Automated headless Chrome screenshot utility
       ├── capture_dropdowns.py    # Dropdown menu QA screenshot script
       ├── fix_missing_css_images.py # CSS background-image localization script
       └── localize_assets.py      # Full asset downloader & path relativizer
   ```

---

## 🚀 3. Running Locally

### Option A: Using Python (Universal across Windows, macOS, Linux)
Open your terminal / command prompt, navigate to the folder, and run:
```bash
python -m http.server 8000
```
Then open your browser and navigate to:
👉 **`http://localhost:8000/`**

### Option B: Windows PowerShell Script
Double-click or run:
```powershell
.\start_server.ps1
```

---

## ✏️ 4. How to Make Changes

1. **Editing Content / Copy:**
   - Open any `.html` file (`index.html`, `services.html`, etc.) in your code editor and edit the text.
   - Global contact numbers, email addresses, and schema blocks have been standardized to `(860) 805-0061` and `estimating@lionstonefloors.com`.

2. **Modifying Styling & Visuals:**
   - All custom style overrides, transitions, animations, and color adjustments are located in:
     `assets/css/customstyle.css`

3. **Replacing or Adding Images:**
   - Place new image files in `assets/images/`.
   - In HTML, reference them with relative paths: `<img src="./assets/images/your-image.jpg" ...>`

4. **Forms and Lead Capture:**
   - Lead forms and consultation triggers are managed in `assets/js/form_handler.js`.
   - Contact form iframes embed the official FloorLaunch / LeadConnector widget (`https://links.floorlaunch.com/widget/form/8NspFPVIP0Lxw5uBRMkY`).

---

## 🚢 5. Deploying to Netlify (Live Production)

The live website `https://lionstonefloors.com/` is hosted on **Netlify**.

### Option A: Netlify Web Dashboard (Drag-and-Drop)
1. Log into your [Netlify Dashboard](https://app.netlify.com/).
2. Select the site: **`storied-capybara-52de2d`** (or whichever site name is attached to `lionstonefloors.com`).
3. Go to the **Deploys** tab.
4. Drag and drop the entire project folder directly into the deploy drop zone.
5. Netlify will publish the updates live to `lionstonefloors.com` in seconds.

### Option B: Netlify CLI
1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```
2. In the project directory, log in and deploy:
   ```bash
   netlify login
   netlify deploy --prod --dir=.
   ```

---

## 🌐 6. Domain & DNS Configuration

If DNS records ever need verification at the registrar (Squarespace, GoDaddy, Namecheap, Cloudflare, etc.):
- **Apex Domain (`@` / `lionstonefloors.com`):**
  - Type: `A` Record
  - Value: `75.2.60.5`
- **Subdomain (`www` / `www.lionstonefloors.com`):**
  - Type: `CNAME` Record
  - Value: `storied-capybara-52de2d.netlify.app`
- **SSL / HTTPS:** Automated via Let's Encrypt on Netlify.
