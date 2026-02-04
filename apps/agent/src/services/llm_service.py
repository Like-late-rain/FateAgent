from __future__ import annotations

import json
import os
from typing import Any

from openai import OpenAI

from .prompt_loader import load_system_prompt
from .types import AnalysisPayload


def _get_env_int(name: str, default: int) -> int:
    value = os.getenv(name)
    if not value:
        return default
    try:
        return int(value)
    except ValueError:
        return default


def _create_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not configured")
    return OpenAI(api_key=api_key)


def _build_messages(payload: AnalysisPayload) -> list[dict[str, str]]:
    system_prompt = load_system_prompt()
    user_message = (
        "请基于以下信息进行分析：\n"
        f"主队: {payload.home_team}\n"
        f"客队: {payload.away_team}\n"
        f"赛事: {payload.competition}\n"
        f"比赛日期: {payload.match_date}\n"
    )
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message},
    ]


def _parse_json(content: str) -> dict[str, Any]:
    data = json.loads(content)
    if not isinstance(data, dict):
        raise ValueError("LLM response is not a JSON object")
    return data


def call_llm(payload: AnalysisPayload) -> dict[str, Any]:
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    max_tokens = _get_env_int("OPENAI_MAX_TOKENS", 1200)
    timeout = _get_env_int("OPENAI_TIMEOUT", 60)
    retries = _get_env_int("OPENAI_RETRIES", 3)

    client = _create_client()
    messages = _build_messages(payload)

    last_error: Exception | None = None
    for _ in range(retries):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=0.4,
                timeout=timeout,
            )
            content = response.choices[0].message.content or "{}"
            return _parse_json(content)
        except Exception as exc:  # noqa: BLE001
            last_error = exc

    if last_error:
        raise last_error
    raise RuntimeError("LLM call failed")
