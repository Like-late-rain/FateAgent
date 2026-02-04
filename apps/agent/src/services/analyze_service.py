from __future__ import annotations

import os
from typing import Any

from pydantic import ValidationError

from .llm_service import call_llm
from .mock_service import build_mock_result
from .types import AnalysisPayload
from ..models.schemas import AnalysisResult
from ..utils.constants import DISCLAIMER_TEXT


def _has_openai_key() -> bool:
    return bool(os.getenv("OPENAI_API_KEY"))


def _normalize_result(data: dict[str, Any]) -> AnalysisResult:
    return AnalysisResult.model_validate(data)


def analyze_match(payload: AnalysisPayload) -> AnalysisResult:
    if not _has_openai_key():
        return AnalysisResult.model_validate(build_mock_result(payload))

    try:
        data = call_llm(payload)
        return _normalize_result(data)
    except ValidationError:
        return AnalysisResult.model_validate(build_mock_result(payload))
    except Exception:
        return AnalysisResult.model_validate(build_mock_result(payload))


def get_disclaimer() -> str:
    return DISCLAIMER_TEXT
