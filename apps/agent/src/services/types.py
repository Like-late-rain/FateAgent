from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class AnalysisPayload:
    home_team: str
    away_team: str
    competition: str
    match_date: str
