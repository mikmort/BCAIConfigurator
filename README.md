# BCAIConfigurator

This static web app provides an interview style experience that helps users configure Dynamics 365 Business Central. The app loads a baseline **RapidStart.xml** file from Azure Blob Storage and creates a customized file based on the user's responses. Azure OpenAI can be called (via the `/api/openai` endpoint) to assist with configuration decisions.

To run locally, simply open `index.html` in a browser. The app is designed for Azure Static Web Apps and uses React delivered via CDN with Babel for quick prototyping.
