import os

DEFAULT_MODEL = "gpt-4-turbo-preview"
DEFAULT_MAX_TOKENS = 2000
DEFAULT_TIMEOUT_SECONDS = 60
DEFAULT_LOG_LEVEL = "INFO"


def get_settings() -> dict:
    return {
        "openai_api_key": os.getenv("OPENAI_API_KEY", ""),
        "openai_model": os.getenv("OPENAI_MODEL", DEFAULT_MODEL),
        "openai_max_tokens": int(os.getenv("OPENAI_MAX_TOKENS", str(DEFAULT_MAX_TOKENS))),
        "openai_timeout": int(os.getenv("OPENAI_TIMEOUT", str(DEFAULT_TIMEOUT_SECONDS))),
        "agent_api_key": os.getenv("AGENT_API_KEY", ""),
        "log_level": os.getenv("LOG_LEVEL", DEFAULT_LOG_LEVEL),
    }
