# SME/CADEX Affectation Management System

An automated professional React application for CIS Operators to manage logistics and workforce distribution. Designed specifically for SME/CADEX operations.

## Technologies Used
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- PWA Configuration

## Local Development
1. Run `npm install` to install dependencies.
2. Run `npm run dev` to start the local development server.

## Deploying to GitHub Pages (Automated & Manual)

This repository includes a ready-to-use GitHub Actions workflow.

1. Upload/push this complete repository to a new repository on GitHub.
2. Go to your GitHub repository settings: **Settings > Pages**.
3. Under **Build and deployment**, ensure the **Source** is set to **GitHub Actions**, and a deployment will start automatically.
4. If you face a blank page, ensure this code includes the `base: './'` inside `vite.config.ts` and the `.nojekyll` file inside the `public/` directory (both included here).
5. Once green, your PWA app will be live and accessible!
