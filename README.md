# It_Solutions_website

STACKLY IT website, published with GitHub Pages:

https://chennamsettyguruteja.github.io/It_Solutions_website/

The site files are in `frontend/`. The root `index.html` forwards visitors to the frontend home page.

## Account API configuration

The GitHub Pages site is static; login and registration require the FastAPI backend in `backend/` to be deployed separately with a persistent database. Configure the backend's `CORS_ORIGINS` environment variable to include `https://chennamsettyguruteja.github.io` (the default includes it), then set `window.STACKLY_API_BASE_URL` in `frontend/api-config.js` to the backend's public HTTPS origin. Do not point the published site at `127.0.0.1`; that address refers to each visitor's own computer.

For local development, `api-config.js` uses `http://127.0.0.1:8000` on localhost automatically. The production API URL is intentionally left unset until a backend host is configured.
