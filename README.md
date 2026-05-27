# Retrospective Wall

A single-page Angular 18 application for running team retrospectives. Capture observations across four fixed sections, vote on what matters, drag cards between columns, and pick up where you left off next session -everything persists to `localStorage`.

## Features

- Four themed sections =>  **What went well**, **What can be improved**, **Start doing**, **Action Items**
- Add, edit (inline + modal), delete, and upvote cards
- Drag-and-drop reordering within and between sections (powered by `@angular/cdk`)
- Filter to a single section and sort by created time or votes
- localStorage persistence => reload-safe
- Responsive layout: 2×2 grid on tablet/desktop, single column on mobile
- CSS-only preloader, focus management, and keyboard support

## Run locally

```bash
npm install
npm start         # http://localhost:4200
npm test          # Karma + Jasmine
npm run build     # production bundle
