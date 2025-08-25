# Авто Гост — статический сайт

This repository contains the static front-end for **Авто Гост** — транспортно-логистического партнёра по России.

## Structure

```
├── index.html                # Homepage
├── services.html             # Service overview with anchors
├── about.html                # Company information
├── news.html                 # Blog / News hub
├── contact.html              # Contact form
├── faq.html                  # Frequently asked questions
├── privacy.html              # Privacy policy
├── assets/
│   ├── css/styles.css        # Base styles
│   └── js/main.js            # JS for nav + form validation
├── assets/img/               # WebP/AVIF images directory
├── robots.txt                # Robots rules for Yandex & co.
└── sitemap.xml               # Sitemap linked from robots.txt
```

## Local preview
Simply use any static server. Example with Python 3:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Deployment
Upload all files to your hosting’s `public_html` (or root) directory.

## Git commands
Initialise a local repo, commit and push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit of static site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/123.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub login. A personal access token may be required for authentication.