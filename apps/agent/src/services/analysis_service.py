import json
from typing import Any, Dict

from src.models.analysis_models import AnalysisPayload, AnalysisRequest, AnalysisFactor
from src.prompts.analysis_prompt import build_messages, DISCLAIMER
from src.services.openai_client import call_openai

DEFAULT_CONFIDENCE = 0.55
FALLBACK_ANALYSIS = "暂无足够信息生成深入分析。"


def parse_result(content: str) -> AnalysisPayload:
    try:
        data = json.loads(content)
        factors = [AnalysisFactor(**factor) for factor in data.get("factors", [])]
        return AnalysisPayload(
            prediction=data.get("prediction", "平局"),
            confidence=float(data.get("confidence", DEFAULT_CONFIDENCE)),
            analysis=data.get("analysis", FALLBACK_ANALYSIS),
            factors=factors,
        )
    except (ValueError, TypeError) as exc:
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
