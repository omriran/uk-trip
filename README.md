# Wild Britain — UK Family Road Trip

Interactive road trip planner with two itinerary options, Wikipedia photos, and day-by-day activity guide.

## Deploy to GitHub Pages

### First time setup

```bash
# 1. Install dependencies
npm install

# 2. Create GitHub repo (requires GitHub CLI)
gh repo create uk-trip --public --push --source=.

# OR manually: create a repo called "uk-trip" on github.com, then:
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/YOUR_USERNAME/uk-trip.git
git push -u origin main
```

### Deploy

```bash
npm run deploy
```

This builds the app and pushes it to the `gh-pages` branch automatically.

### Enable GitHub Pages

1. Go to your repo on github.com
2. Settings → Pages
3. Source: **Deploy from branch**
4. Branch: **gh-pages** / **/ (root)**
5. Save

Your site will be live at:
```
https://YOUR_USERNAME.github.io/uk-trip/
```

### Update the site

Any time you make changes, just run:
```bash
npm run deploy
```

## Local development

```bash
npm run dev
```

Opens at http://localhost:5173

## Notes

- If your GitHub repo is named something other than `uk-trip`, update the `base` field in `vite.config.js` to match
- Photos are fetched live from Wikipedia's public API — they load a second or two after the page opens
