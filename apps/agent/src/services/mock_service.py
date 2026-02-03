from __future__ import annotations

from .types import AnalysisPayload


def build_mock_result(payload: AnalysisPayload) -> dict:
    return {
        "prediction": "平局",
        "confidence": 0.52,
        "analysis": f"{payload.home_team} 与 {payload.away_team} 近期表现接近，结果存在不确定性。",
        "factors": [
            {
                "name": "近期状态",
                "impact": "neutral",
                "description": "双方近 5 场胜率接近，优势不明显。",
            },
            {
                "name": "主客场因素",
                "impact": "positive",
                "description": "主队主场得分率略高。",
            },
        ],
    }
