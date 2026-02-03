import json
from typing import Any, Dict

from pydantic import ValidationError

from src.models.analysis_models import AnalysisPayload, AnalysisRequest
from src.prompts.analysis_prompt import build_messages, DISCLAIMER
from src.services.openai_client import call_openai

DEFAULT_CONFIDENCE = 0.55
FALLBACK_ANALYSIS = "暂无足够信息生成深入分析。"


def parse_result(content: str) -> AnalysisPayload:
    try:
        data = json.loads(content)
        if not isinstance(data, dict):
            raise ValueError("模型输出格式无效")
        if "confidence" in data:
            data["confidence"] = float(data["confidence"])
        if "analysis" not in data:
            data["analysis"] = FALLBACK_ANALYSIS
        if "prediction" not in data:
            data["prediction"] = "平局"
        return AnalysisPayload.model_validate(data)
    except (ValueError, TypeError, ValidationError) as exc:
        raise ValueError("解析模型输出失败") from exc


def analyze_match(payload: AnalysisRequest) -> Dict[str, Any]:
    messages = build_messages(
        {
            "homeTeam": payload.home_team,
            "awayTeam": payload.away_team,
            "competition": payload.competition,
            "matchDate": payload.match_date,
        }
    )
    response = call_openai(messages)
    result = parse_result(response["content"])
    return {"result": result, "disclaimer": DISCLAIMER}
