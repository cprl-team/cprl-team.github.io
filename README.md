# CPRL — Causal Perception and Reasoning Lab

A minimalist static website for the [CPRL research group](https://cpr.ai.vn/), built with vanilla HTML, CSS, and JavaScript. Deployed on GitHub Pages.

## 🚀 Quick Start

### Prerequisites
- Python 3 (for local dev server) or any static file server
- Git (for deployment)

### Run Locally

```bash
# Clone the repository
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# Start a local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

> **Alternative servers:**
> ```bash
> # Node.js
> npx serve .
>
> # PHP
> php -S localhost:8000
> ```

## 📁 Project Structure

```
├── index.html              # Home page
├── publications.html       # Publications page
├── members.html            # Team members page
├── achievements.html       # Achievements page
├── 404.html                # Custom 404 page
├── logo.jpg                # CPRL logo
├── .nojekyll               # Disable Jekyll on GitHub Pages
├── css/
│   ├── variables.css       # Design tokens (colors, fonts, spacing)
│   ├── base.css            # Reset & typography
│   ├── layout.css          # Header, grid, footer
│   ├── components.css      # Cards, buttons, badges
│   └── pages.css           # Page-specific styles
├── js/
│   ├── theme.js            # Dark/light mode toggle
│   ├── navigation.js       # Active links & mobile menu
│   ├── main.js             # Scroll animations
│   └── content-loader.js   # Markdown content parser
├── content/                # ✏️ Editable content (markdown)
│   ├── home.md
│   ├── publications.md
│   ├── members.md
│   └── achievements.md
└── .github/workflows/
    └── deploy.yml          # GitHub Actions deployment
```

## ✏️ Updating Content

Edit the markdown files in `content/` and update the corresponding HTML:

| To update...     | Edit this file            |
| ---------------- | ------------------------- |
| Research areas   | `content/home.md`         |
| Papers & patents | `content/publications.md` |
| Team members     | `content/members.md`      |
| Challenge wins   | `content/achievements.md` |

## 🌗 Theme

The site supports dark/light mode via the toggle button in the header. Preference is saved to `localStorage`.

## 🚢 Deploy to GitHub Pages

1. Push to the `main` branch:
   ```bash
   git add -A
   git commit -m "Update website"
   git push origin main
   ```

2. In GitHub: **Settings → Pages → Source → GitHub Actions**

The included `.github/workflows/deploy.yml` handles automatic deployment on every push to `main`.

## License

© 2025 CPRL — Causal Perception and Reasoning Lab. All rights reserved.
