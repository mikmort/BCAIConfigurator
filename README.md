# BCAIConfigurator

This static web app provides an interview style experience that helps users configure Dynamics 365 Business Central. The app loads a baseline **starting data** JSON file from Azure Blob Storage and creates a customized file based on the user's responses. The default data is loaded from `https://bconfigstorage.blob.core.windows.net/bctemplates/NAV27.0.US.ENU.EXTENDED.json`. Azure OpenAI can be called (via the `/api/openai` endpoint) to assist with configuration decisions.

The source is now written in TypeScript (`src/app.tsx`). Run `npx tsc` to transpile it to JavaScript before opening `index.html` in a browser. The app is designed for Azure Static Web Apps and uses React delivered via CDN for quick prototyping.
