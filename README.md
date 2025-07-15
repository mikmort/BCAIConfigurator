# BCAIConfigurator

This static web app provides an interview style experience that helps users configure Dynamics 365 Business Central. The app loads a baseline **starting data** JSON file from Azure Blob Storage and creates a customized file based on the user's responses. The default data is loaded from `https://bconfigstorage.blob.core.windows.net/bctemplates/NAV27.0.US.ENU.EXTENDED.json`. Azure OpenAI can be called (via the `/api/openai` endpoint) to assist with configuration decisions.

The source is now written in TypeScript (`src/app.tsx`). Run `npx tsc` to transpile it to JavaScript before opening `index.html` in a browser. The app is designed for Azure Static Web Apps and uses React delivered via CDN for quick prototyping.

When running locally make sure to serve the files through a local web server instead of opening `index.html` directly. Browsers often block network requests from the `file:` protocol which will cause errors like `Failed to fetch` when loading the starting data or Azure Storage script. A simple option is `npx http-server`.

To enable uploading the generated RapidStart file, fill in `env.js` with your Azure Storage connection string. The
`env.js` file is ignored by git so your secrets remain private.

The Azure Storage library loaded from the CDN exposes a global `azblob` object. The app uses this object when uploading your customized RapidStart file.
