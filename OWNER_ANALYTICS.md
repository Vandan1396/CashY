# CashV v6 — Privacy-Friendly Owner Analytics

CashV v6 adds privacy-friendly analytics using GoatCounter.

## What is tracked

Only anonymous/aggregate usage such as:
- visits/page views
- browser/system categories
- approximate country (if enabled by the analytics service)
- screen width (if enabled)
- app events such as `app-open`, `expense-added`, `budget-updated`, `profile-updated`, and theme/navigation events

## What is NOT sent

CashV does NOT send:
- user's name
- age
- gender
- phone number
- email
- city
- budget amount
- expense amount
- expense note
- expense category
- payment method
- profile contents

## One-time setup

1. Open GoatCounter and create an account/site.
2. Choose a site code for your CashV website.
3. Copy the site code.
4. Open `analytics.js`.
5. Replace:

   `YOUR_GOATCOUNTER_CODE`

   with your actual GoatCounter site code.

   Example:

   `const CODE = "cashv123";`

6. Upload `analytics.js`, `index.html`, and `app.js` to GitHub.
7. Commit the changes.
8. Open your GoatCounter dashboard to see visits and events.

Do not put your GoatCounter login password or private credentials into CashV code.

## Recommended owner view

Use the GoatCounter dashboard as the private owner analytics dashboard. It is intentionally kept separate from the customer-facing app so customers cannot see your statistics.

## Important

If you don't configure `analytics.js`, CashV continues to work normally; no analytics data is sent.
