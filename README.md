# Expense Tracker

A personal expense tracking app built with React.

## Features
- Log daily expenses with category, account, and notes
- Custom categories and spending accounts
- Recurring expense management (monthly rent, gym, etc.)
- Monthly budget planning with per-category limits
- Pie chart and spending breakdown summary
- 7 themes (dark & light), 5 fonts, 8 accent colours
- Multi-currency support (MYR, USD, SGD, GBP, EUR, JPY, AUD, IDR)
- All data stored locally in the browser

## Setup

```bash
npm install
npm start
```

## Deploy to GitHub Pages

1. Add your repo URL to `package.json`:
   ```json
   "homepage": "https://<your-username>.github.io/<repo-name>"
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## Deploy to Vercel / Netlify
Just connect your GitHub repo — both platforms auto-detect Create React App and deploy with zero config.
