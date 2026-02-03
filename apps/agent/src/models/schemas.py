from __future__ import annotations

from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    home_team: str = Field(..., alias="homeTeam")
    away_team: str = Field(..., alias="awayTeam")
    competition: str
    match_date: str = Field(..., alias="matchDate")


class AnalysisFactor(BaseModel):
    name: str
    impact: str
    description: str


class AnalysisResult(BaseModel):
    prediction: str
    confidence: float
    analysis: str
    factors: list[AnalysisFactor]


class AnalysisResponse(BaseModel):
    result: AnalysisResult
    disclaimer: str
