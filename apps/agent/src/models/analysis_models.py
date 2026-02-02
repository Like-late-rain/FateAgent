from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    home_team: str = Field(..., alias="homeTeam")
    away_team: str = Field(..., alias="awayTeam")
    competition: str
    match_date: str = Field(..., alias="matchDate")


class AnalysisFactor(BaseModel):
    name: str
    impact: Literal["positive", "negative", "neutral"]
    description: str


class AnalysisPayload(BaseModel):
    prediction: Literal["主胜", "平局", "客胜"]
    confidence: float
    analysis: str
    factors: List[AnalysisFactor]


class AnalysisResponse(BaseModel):
    id: str
    status: Literal["completed", "failed"]
    match_info: AnalysisRequest = Field(..., alias="matchInfo")
    result: Optional[AnalysisPayload] = None
    disclaimer: str


class ApiResponse(BaseModel):
    success: bool
    data: Optional[AnalysisPayload] = None
    disclaimer: Optional[str] = None
    error: Optional[dict] = None
