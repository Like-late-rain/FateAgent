from typing import Any, Dict

from openai import OpenAI

from src.config import get_settings

MAX_RETRIES = 3


def call_openai(messages: list[Dict[str, str]]) -> Dict[str, Any]:
    settings = get_settings()
    api_key = settings["openai_api_key"]
    if not api_key:
        raise ValueError("OPENAI_API_KEY 未配置")

    client = OpenAI(api_key=api_key, timeout=settings["openai_timeout"])
    last_error: Exception | None = None

    for _ in range(MAX_RETRIES):
        try:
            response = client.chat.completions.create(
                model=settings["openai_model"],
                messages=messages,
                max_tokens=settings["openai_max_tokens"],
            )
            content = response.choices[0].message.content
            if not content:
                raise ValueError("OpenAI 返回内容为空")
            return {"content": content}
        except Exception as exc:  # noqa: BLE001
            last_error = exc

    raise RuntimeError(f"OpenAI 调用失败: {last_error}")
