from fastapi import FastAPI, Header, HTTPException

from src.config import get_settings
from src.constants import ANALYSIS_FAILED_CODE, STATUS_OK, UNAUTHORIZED_MESSAGE
from src.models.analysis_models import AnalysisRequest, ApiResponse
from src.prompts.analysis_prompt import DISCLAIMER
from src.services.analysis_service import analyze_match

app = FastAPI(title="FateAgent Agent")


@app.get("/health")
def health_check() -> dict:
    return STATUS_OK


@app.post("/api/v1/analyze", response_model=ApiResponse)
def analyze_endpoint(payload: AnalysisRequest, x_api_key: str | None = Header(default=None)) -> ApiResponse:
    settings = get_settings()
    required_key = settings["agent_api_key"]
    if required_key and x_api_key != required_key:
        raise HTTPException(status_code=401, detail=UNAUTHORIZED_MESSAGE)

    try:
        result = analyze_match(payload)
        return ApiResponse(success=True, data=result["result"], disclaimer=result["disclaimer"])
    except Exception as exc:  # noqa: BLE001
        return ApiResponse(
            success=False,
            disclaimer=DISCLAIMER,
            error={"code": ANALYSIS_FAILED_CODE, "message": str(exc)},
        )
