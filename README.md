# BCAIConfigurator

This static web app provides an interview style experience that helps users configure Dynamics 365 Business Central. The app loads a baseline **starting data** XML file included in the repository and creates a customized file based on the user's responses. Azure OpenAI can be called to assist with configuration decisions by placing your credentials in `openai.js`.

The project now uses **Vite** for development and builds. All source files, including `index.html`, live in the `src` directory. Run `npm run build` to output the production files to the `dist` folder. 

When running locally make sure to serve the files through a local web server instead of opening `index.html` directly. Browsers often block network requests from the `file:` protocol which will cause errors like `Failed to fetch` when loading the starting data or Azure Storage script. A simple option is `npx http-server`.

To enable uploading the generated RapidStart file, fill in `env.js` with your Azure Storage connection string. The
`env.js` file is ignored by git so your secrets remain private.

The Azure Storage library loaded from the CDN exposes a global `azblob` object. The app uses this object when uploading your customized RapidStart file.

