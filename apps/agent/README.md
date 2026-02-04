# Agent Service

## Tech stack
- Python 3.11
- FastAPI + Uvicorn
- OpenAI SDK
- Pydantic

## Environment variables
- OPENAI_API_KEY (optional; when unset, returns mock results)
- OPENAI_MODEL (default: gpt-4o-mini)
- OPENAI_MAX_TOKENS (default: 1200)
- OPENAI_TIMEOUT (default: 60)
- OPENAI_RETRIES (default: 3)
- AGENT_API_KEY (optional; if set, requests must include X-API-KEY)

## Local development
From `apps/agent`:
- Install deps: `pip install -r requirements.txt`
- Start dev server: `uvicorn src.main:app --reload --host 0.0.0.0 --port 8000`

## Docker
Build from the repo root:

```bash
docker build -f apps/agent/Dockerfile -t fateagent-agent apps/agent
```

Run:

```bash
docker run --rm -p 8000:8000 fateagent-agent
```
