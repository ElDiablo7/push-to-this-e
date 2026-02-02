# Deploying GRACE-X to Render

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

- `OPENAI_MODEL` — e.g. `gpt-4o-mini`
- `CORS_ORIGINS` — e.g. `https://yourdomain.com` (for custom domain)
- `NODE_ENV` — `production`

Full list and provider-specific keys: see [server/README.md](server/README.md#deploying-on-render-no-env-file).
