# SkillLane Merit — Prototype

[![Live](https://img.shields.io/badge/live-GH%20Pages-success)](https://thitic9203.github.io/skilllane-merit-prototype/)

**Live:** <https://thitic9203.github.io/skilllane-merit-prototype/>

## What it is

A shareable, click-through prototype of SkillLane Merit — an internal recognition / merit-points / rewards platform for SkillLane employees. It covers the full demo surface (dashboard, leaderboard, rewards, recognition, profile, approvals, reports) with mocked data so reviewers can navigate and interact end-to-end. It is a design prototype, not a working product.

## Tech

- React 18 (UMD CDN) + in-browser Babel 7.29.0 for JSX transform
- Vanilla HTML / CSS with design tokens, Inter font
- No build step, no bundler, no package manager — just static files served by GitHub Pages

Caveat: this repo is for preview only. Anything heading toward production belongs in the product repo, not here.

## Repo layout

```
.
├── index.html              # Entry point; loads React, Babel, and all JSX
├── components/
│   ├── App.jsx             # Root shells (Desktop + Mobile), state, routing
│   ├── Shared.jsx          # TopNav, Sidebar, MobileTabs, Avatar, Icon, etc.
│   ├── Overlays.jsx        # NotificationsPanel, SearchPopover, MobileMenuDrawer
│   ├── Toast.jsx           # ToastProvider + useToast() hook
│   ├── States.jsx          # Loading / empty / error state primitives
│   ├── Skeleton.jsx        # Skeleton loaders
│   ├── ScreenHeader.jsx    # Page header component
│   ├── Reference.jsx       # Preview toolbar (state-mode tabs)
│   ├── Shortcuts.jsx       # Keyboard shortcut helpers
│   └── screens/            # Dashboard, History, Rewards, Leaderboard,
│                           # Award, Team, Feed, Profile, Login
├── data/
│   └── mockdata.js         # Demo user, leaderboard, activities, rewards
├── styles/
│   └── tokens.css          # Design tokens (colors, spacing, type)
└── README.md
```

## Update workflow

1. Re-export the prototype from [Claude Design](https://claude.ai/design/p/b18fac17-3c7f-4ddd-ad91-f5ef0656a81a) (auth required) as a multi-file build.
2. Unzip the export, then copy into this repo:
   - `SkillLane Merit.html` → `index.html`
   - `components/` → `components/`
   - `data/` → `data/`
   - `styles/` → `styles/`
   - Skip `screenshots/` and `uploads/` — not needed for the live site.
3. Apply demo-account patches:
   - Open `components/screens/Dashboard.jsx` and remove any trailing `.` at the end of the greeting `<h1>` (Claude Design sometimes re-adds it).
   - Open `data/mockdata.js` and confirm the demo user is `Thitichaya Chaiyaporn`, `avatarInitials: "TC"`, `rank: 7`.
4. Commit and push to `main`:
   ```bash
   git add -A
   git commit -m "Refresh prototype from Claude Design export"
   git push origin main
   ```
5. Wait for the GitHub Pages build (~30–90s), then for Fastly edge cache (up to ~10 min). During testing, cache-bust with a query string:
   <https://thitic9203.github.io/skilllane-merit-prototype/?v=20260423>

## Do not deploy the Standalone bundle

Claude Design also offers a single-file `* - Standalone.html` export. **Do not deploy it.** Its bundler strips event handlers, so the notification bell and ⌘K search render as dead static UI — pretty, but broken.

Quick diagnostic — from the repo root:

```bash
grep -l '<script type="__bundler/manifest">' index.html
```

If that prints `index.html`, you shipped the Standalone variant. Re-export as multi-file and re-copy.

## Deployment checks

After a push, verify the live site is both fresh and interactive:

- Load the site with a cache-bust query string and check the dashboard greets `Thitichaya` with rank 7 and `TC` avatar.
- Click the notification bell — the panel should open with mock notifications.
- Press ⌘K (or Ctrl+K) — the command palette should open and filter as you type.
- Toggle light/dark theme and confirm tokens swap.
- On mobile width, the hamburger drawer should open with all 6 bottom-tab destinations.
- Grep the served HTML/JS for stale placeholder names — `Arisara` and `Prasertsuk` should return 0 matches.

## Navigation

- Desktop sidebar (8): Dashboard, My Activities, Leaderboard, Rewards, Recognition, My Profile, Approvals, Reports
- Mobile bottom tabs (6): a curated subset of the above

Interactive features currently wired up: notification bell + panel, ⌘K search palette, theme toggle (light/dark), mobile hamburger drawer.

## Known gaps

- "Edit profile" and some secondary actions may be no-ops — this is a prototype, not a working app.
- All data is mocked in `data/mockdata.js`. No backend, no auth, no persistence.
- In-browser Babel adds ~1–2s first-load cost. Acceptable for a demo; do not use this pattern in production.

## QA log

### R2b — 2026-04-24

**aria-label check (Profile screen)**

| Selector | Expected | Actual | Result |
|---|---|---|---|
| `[aria-label*="year over year"]` | `"Moved up 2 places year over year"` | `"Moved up 2 places year over year"` | PASS |

**9-screen smoke test**

| # | Screen | Renders | Heading | Bell | Search | Console errors |
|---|---|---|---|---|---|---|
| 1 | Dashboard | ✅ | Thitichaya | ✅ | ✅ | 0 |
| 2 | My Activities | ✅ | Points history | ✅ | ✅ | 0 |
| 3 | Leaderboard | ✅ | Leaderboard | ✅ | ✅ | 0 |
| 4 | Rewards | ✅ | Rewards | ✅ | ✅ | 0 |
| 5 | Recognition | ✅ | Recognition | ✅ | ✅ | 0 |
| 6 | My Profile | ✅ | Thitichaya Chaiyaporn | ✅ | ✅ | 0 |
| 7 | Approvals | ✅ | Award points | ✅ | ✅ | 0 |
| 8 | Reports | ✅ | Team dashboard | ✅ | ✅ | 0 |
| 9 | Notifications panel (bell click) | ✅ | Notifications | ✅ | ✅ | 0 |

Known gaps (not counted as failures): Dashboard has no YoY rank UI; Toast title+body concat missing space.

**Verdict: 🟢 PASS** — all 9 screens render, bell opens Notifications panel, search focusable, 0 console errors.
