# NVIDIA Portfolio Simulator (academic )

Original branding; not affiliated with NVIDIA or any financial service. **Every balance, return and transaction is .** Static site: HTML, CSS, vanilla JS, Chart.js via CDN, no build step.

## Run locally

1. Download the ZIP (or `git clone`) and unzip it.
2. Open `index.html`, or serve the folder: `python3 -m http.server 8000` then visit http://localhost:8000.

## login

. These are nstration credentials shown on the login page and present in `js/data.js`. Client-side login is **not secure authentication** and protects nothing. The session lives in `sessionStorage`; no password is stored.

## Test the features

Log in; open every page from the sidebar (drawer on phones); filter and export CSV on Transactions; open a month on Statements; submit a deposit and a withdrawal (review, then confirm), then click "Simulate approval" on a pending deposit; mark notifications read; change name, theme and picture on Profile; reload to confirm persistence; use "Reset all data".

## How balances work

`js/data.js` builds the ledger from fixed basis-point returns in integer cents. October 2026 is a partial month (to Oct 28) and balances the total so profit is exactly $1,000,000.00 and the final balance exactly $2,500,000.00; the page throws an error if it does not reconcile. deposits and withdrawals are stored separately and only change the "available balance".

## Publish on GitHub Pages

1. Push the files to a repository with `index.html` at the repository root.
2. Settings > Pages > Build and deployment > Deploy from a branch > choose `main` and `/ (root)` > Save.
3. Open `https://USERNAME.github.io/REPOSITORY/` after a minute. All links are relative, so the project subpath works.

## Troubleshooting

- Unstyled page or missing scripts: file and folder names are case-sensitive; keep `css/` and `js/` beside the HTML files; hard-refresh.
- Blank charts: the Chart.js CDN is blocked or offline.
- Broken navigation: do not change links to start with `/`.

## Test responsiveness

Browser DevTools > device toolbar (Ctrl+Shift+M) and check 320, 375, 430, 768, 1024, 1440 and 1920 px wide.

## Limitations

No real authentication, no server, no real funds, wallets or blockchain access. localStorage is per browser, per device, and anyone can edit it. The ledger is deterministic data, not evidence of investment performance.

## Change the logo and site name (code only)

1. Copy your logo into `assets/images/` (for example `logo.png`).
2. Open `js/data.js`. At the very top, edit `BRAND`:
   `const BRAND={name:'My Name',logo:'assets/images/logo.png'};`
3. Save and refresh. The name and logo change on every page, including the login page and the browser tab title. There are no in-app controls for this.

The "ACADEMIC " banner is set separately in `DISC` (`js/data.js`) and is not affected by renaming.
