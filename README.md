# PokeRookie TCG — Inventory Manager

Dark-themed Pokemon TCG inventory app for tracking cards/products across Melbourne → Cebu consignment sales.

---

## Setup Guide

### 1. Install dependencies

```bash
cd pokerookie-tcg
npm install
```

### 2. Configure Firebase

**Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com):
- Enable **Firestore Database** (start in production mode)
- Enable **Authentication → Google Sign-In**

**Get your config keys:**
Firebase Console → Project Settings → Your Apps → Add Web App → copy the config object.

**Get your Google UID:**
Firebase Console → Authentication → Users → sign in once with Google → copy your UID.

**Fill in the placeholders** in `src/firebase/config.js`:
```js
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
export const ADMIN_UID = "YOUR_GOOGLE_UID";
```

### 3. Set Firestore Security Rules

Firebase Console → Firestore Database → Rules → paste the contents of `src/firebase/rules.txt` → replace `REPLACE_WITH_YOUR_GOOGLE_UID` with your actual UID → **Publish**.

### 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:5173/pokerookie-tcg/`

### 5. Deploy to GitHub Pages

**One-time setup:**
1. Create a GitHub repo named `pokerookie-tcg`
2. Push your code: `git init && git add . && git commit -m "init" && git remote add origin <your-repo-url> && git push -u origin main`
3. In GitHub repo settings → Pages → Source: `gh-pages` branch

**Deploy:**
```bash
npm run deploy
```

This runs `vite build` then pushes the `dist/` folder to the `gh-pages` branch automatically.

Your app will be live at: `https://<your-github-username>.github.io/pokerookie-tcg/`

---

## Architecture

| Path | Purpose |
|------|---------|
| `src/firebase/config.js` | Firebase init + ADMIN_UID constant |
| `src/firebase/rules.txt` | Firestore security rules to copy |
| `src/hooks/useAuth.js` | Google Sign-In, admin check |
| `src/hooks/useInventory.js` | Firestore CRUD for items |
| `src/hooks/useShipments.js` | Firestore CRUD for shipments |
| `src/utils/profitCalc.js` | AUD/PHP profit calculations |
| `src/pages/StockPage.jsx` | Main inventory view |
| `src/pages/SalesPage.jsx` | Sold items + profit summary |
| `src/pages/ShipmentsPage.jsx` | Air/Sea cargo tracking |
| `src/pages/DashboardPage.jsx` | Overview stats |

## Security Notes

- Public users can **read** all data (view-only)
- Only the hardcoded UID can **write** (add/edit/delete)
- Auth check happens in both Firestore rules (server-side) and the hooks (client-side guard)
- All Firestore listeners unsubscribe on component unmount
