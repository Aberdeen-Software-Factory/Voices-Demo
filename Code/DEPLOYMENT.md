# VOICES Toolkit Deployment

## What to upload

Upload the contents of this `Code` folder as the web root. The site is static and does not need a build step.

Production URL: https://voices.asf.abdn.ac.uk/

Deployment host: https://sbx-voices-1.abdn.ac.uk/
CNAME/alias: https://voices.asf.abdn.ac.uk/

Google Analytics:

- Stream URL: `https://sbx-voices-1.abdn.ac.uk`
- Public CNAME: `https://voices.asf.abdn.ac.uk`
- Stream ID: `15220232481`
- Measurement ID: `G-SDVPNJ73Y3`

Required files and folders:

- `index.html`
- `css/`
- `javascript/`
- `Figures/`

## Before production

- Confirm the server uses HTTPS.
- Confirm both `https://sbx-voices-1.abdn.ac.uk/` and `https://voices.asf.abdn.ac.uk/` resolve to the deployed app.
- Confirm Google Analytics receives the initial page view and hash-route page views in Realtime.
- Confirm third-party CDN access is allowed for:
  - Google Fonts
  - `googletagmanager.com` for Google Analytics
  - `cdnjs.cloudflare.com` for `xlsx`, `jspdf`, and `html2canvas`
- If using nginx, adapt `nginx-site.conf.example` and copy the `Code` folder contents to the configured `root`.

## Smoke test after upload

- Open the home page and confirm the VOICES logo and service component diagram load.
- Open each top navigation item: Home, Toolkit, About.
- In Toolkit, open each section and confirm accordions expand.
- Open the Cost Calculator and generate an estimate.
- Open Resources and confirm resource detail links behave as expected.
- In Google Analytics Realtime, confirm visits appear for the home page, Toolkit pages, and Resource detail views.
- Check the browser console for failed files or blocked CDN scripts.
