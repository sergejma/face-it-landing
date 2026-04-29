# Face it — Landing Page

Conversion-fokussierte Longform Sales Page für die Face it iOS-App.
Live unter [getfaceit.com](https://getfaceit.com).

## Stack

- **Plain HTML + CSS + JS.** Kein Build-Step, keine Dependencies.
- **Inter** via Google Fonts.
- **GitHub Pages** als Hosting.

## Lokal ansehen

Öffne `index.html` im Browser, oder starte einen lokalen Server:

```bash
python3 -m http.server 4000
# → http://localhost:4000
```

## Erstes Deployment auf GitHub Pages

1. **Repo auf GitHub erstellen** (z.B. `face-it-landing`, public)
2. **Code pushen:**
   ```bash
   git init -b main
   git add .
   git commit -m "Initial landing page"
   git remote add origin git@github.com:<dein-user>/face-it-landing.git
   git push -u origin main
   ```
3. **GitHub Pages aktivieren:**
   - Repo → Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)` → Save
4. **Custom Domain `getfaceit.com`:**
   - Settings → Pages → Custom domain: `getfaceit.com` → Save
   - GitHub erstellt/aktualisiert automatisch das `CNAME` File (liegt schon im Repo).
   - "Enforce HTTPS" aktivieren, sobald das Zertifikat geprovisioned ist (~10 Min).
5. **DNS bei deinem Domain-Provider** (`getfaceit.com`):
   - **Apex (`getfaceit.com`):** A-Records auf:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **`www.getfaceit.com`:** CNAME auf `<dein-user>.github.io`

   Propagation: meist 5–60 Min, max 24h.

## Updates deployen

```bash
git add -A
git commit -m "<change>"
git push
```

GitHub Pages baut automatisch in 1–2 Min neu.

## Tracking nachrüsten

`script.js` ruft bereits `plausible()`, `gtag()` und `fbq()` für jeden CTA-Click auf — `data-cta` markiert die Position (hero, founder, pricing, sticky usw.).

Snippet ins `<head>` von `index.html`:

- **Plausible:** `<script defer data-domain="getfaceit.com" src="https://plausible.io/js/script.js"></script>`
- **GA4:** Standard gtag-Snippet
- **Meta Pixel:** Pixel-Snippet wie üblich

## Struktur

```
.
├── index.html         ← 14 Sections
├── styles.css         ← Brand-System + alle Section-Styles
├── script.js          ← Reveal, Sticky-CTA, Tracking-Hooks
├── CNAME              ← getfaceit.com
├── .nojekyll          ← skipped Jekyll Build
├── robots.txt
├── sitemap.xml
└── assets/
    ├── logo-black.png
    ├── app-icon.png
    ├── stephan.jpg
    ├── hero-illustration.jpg
    ├── gallery-*.jpg     ← App Store Galleriebilder
    └── promo.mp4
```

## Brand-System (kurz)

- Cream Background `#F2EEE5`, Soft `#EDE8DC`, Card `#FAF7F0`
- Ink `#0A0A0A`, Muted `#5A5754`
- Dark Sections `#0D0C0B` mit `#FAF7F0` Text
- Akzent: `#C9A961` (Gold) für Highlights & "Empfohlen"-Badge
- Typo: Inter 400/500/700/800/900 — Headlines `font-weight: 900`, tight letter-spacing

## CTA-Targeting

Alle CTAs zeigen auf den App Store. Track-Locations via `data-cta`:
`header`, `hero`, `founder`, `reviews`, `price-monthly`, `price-yearly`, `price-free`, `final`, `sticky`.
