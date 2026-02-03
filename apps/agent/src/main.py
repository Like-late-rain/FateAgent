import logging

from fastapi import FastAPI, Header, HTTPException

from src.config import get_settings
from src.constants import ANALYSIS_FAILED_CODE, STATUS_OK, UNAUTHORIZED_MESSAGE
from src.models.analysis_models import AnalysisRequest, ApiResponse
from src.prompts.analysis_prompt import DISCLAIMER
from src.services.analysis_service import analyze_match

app = FastAPI(title="FateAgent Agent")
logger = logging.getLogger("fateagent.agent")


@app.get("/health")
def health_check() -> dict:
    return STATUS_OK


@app.post("/api/v1/analyze", response_model=ApiResponse)
def analyze_endpoint(
    payload: AnalysisRequest, x_api_key: str | None = Header(default=None)
) -> ApiResponse:
    settings = get_settings()
    required_key = settings["agent_api_key"]
    if required_key and x_api_key != required_key:
        raise HTTPException(status_code=401, detail=UNAUTHORIZED_MESSAGE)

    logger.info(
        "analysis_request_received",
        extra={"homeTeam": payload.home_team, "awayTeam": payload.away_team},
    )
    try:
        result = analyze_match(payload)
        return ApiResponse(
            success=True, data=result["result"], disclaimer=result["disclaimer"]
        )
    except (RuntimeError, ValueError) as exc:
        logger.error("analysis_request_failed", extra={"error": str(exc)})
        return ApiResponse(
            success=False,
            disclaimer=DISCLAIMER,
            error={"code": ANALYSIS_FAILED_CODE, "message": str(exc)},
        )
