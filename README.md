# CashV — Smart Personal Expense Tracker

A premium, responsive expense-tracking Progressive Web App inspired by the supplied CashV/VandWise UI reference.

## Included
- Premium dark finance UI
- Green + gold CashV branding
- Home dashboard with balance and monthly spending cards
- Monthly donut chart
- Recent transactions
- Analytics and 7-day trend chart
- Budget progress and budget editor
- Profile: Name, Age, Gender, Phone, Email, City
- Add expense modal
- LocalStorage data persistence
- Responsive mobile + desktop UI
- PWA manifest + service worker
- No signup required

## Run locally
Open `index.html` in a modern browser, or use a local static server.

## Publish with GitHub Pages
1. Create a new **Public** repository, for example `CashV`.
2. Upload all files from this folder, including the `icons` folder.
3. Settings → Pages.
4. Source: **Deploy from a branch**
5. Branch: **main**
6. Folder: **/(root)**
7. Save and wait for deployment.

## Important
The application data is stored locally in the browser. It is not automatically shared between different phones or browsers.


## v4 Updates
- No default personal name in the greeting; the user's saved profile name is shown only after they set it.
- Expense confirmation alert showing the amount spent and remaining budget.
- Budget warning at 80% and exceeded at 100%.
- Optional browser notifications for budget milestones.
- Payment method defaults to `Choose payment` and must be selected.
- Dark/light mode toggle.
- Contact Owner section with email and phone.
- JSON backup export and clear-data controls.
