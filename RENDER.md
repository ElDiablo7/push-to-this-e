# Deploying GRACE-X to Render

## Root package.json

The repo has a root `package.json` so Render’s default build and start work without changing settings:

- **Build:** Render runs `npm install` at root → `postinstall` runs `npm install` in `server/`.
- **Start:** Render runs `npm start` → runs `node server.js` from `server/`.

You do **not** need to set “Root Directory” to `server`; keep the service root at the repo root.

## Environment variables (no .env file on Render)

Render does **not** use a `.env` file. You configure environment variables in the Render dashboard:

1. **Dashboard** → your Web Service (e.g. `gracex-film`)
2. **Environment** (left sidebar)
3. **Add Environment Variable** — add each key/value pair

### Minimum to get the Brain API working

| Key | Value |
|-----|--------|
| `LLM_PROVIDER` | `openai` |
| `API_KEY` or `OPENAI_API_KEY` | Your OpenAI API key (e.g. `sk-...`) |

### Optional

- `APP_URL` — Your Render URL (e.g. `https://yourapp.onrender.com`). Backend and frontend use this so they stay in sync; `/api/config` exposes it to the frontend.
- `OPENAI_MODEL` — e.g. `gpt-4o-mini`
- `CORS_ORIGINS` — e.g. `https://yourdomain.com` (for custom domain)
- `NODE_ENV` — `production`

Full list and provider-specific keys: see [server/README.md](server/README.md#deploying-on-render-no-env-file).
