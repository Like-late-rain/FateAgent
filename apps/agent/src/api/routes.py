from __future__ import annotations

import os

from fastapi import APIRouter, Header, HTTPException

from ..models.schemas import AnalysisRequest, AnalysisResponse
from ..services.analyze_service import analyze_match, get_disclaimer
from ..services.types import AnalysisPayload

router = APIRouter(prefix="/api/v1")


def _require_api_key(api_key: str | None) -> None:
    configured = (os.getenv("AGENT_API_KEY") or "").strip()
    expected = (api_key or "").strip()
    if not configured:
        return
    if expected != configured:
        raise HTTPException(status_code=401, detail="Invalid API key")


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    payload: AnalysisRequest, x_api_key: str | None = Header(default=None, alias="X-API-KEY")
) -> AnalysisResponse:
    _require_api_key(x_api_key)
    analysis_payload = AnalysisPayload(
        home_team=payload.home_team,
        away_team=payload.away_team,
        competition=payload.competition,
        match_date=payload.match_date,
    )
    result = analyze_match(analysis_payload)
    return AnalysisResponse(result=result, disclaimer=get_disclaimer())
