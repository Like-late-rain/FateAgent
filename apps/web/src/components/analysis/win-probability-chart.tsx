'use client';

import type { WinProbability } from '@fateagent/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WinProbabilityChartProps {
  homeTeam: string;
  awayTeam: string;
  probability: WinProbability;
}

export function WinProbabilityChart({
  homeTeam,
  awayTeam,
  probability
}: WinProbabilityChartProps) {
  const homePercent = Math.round(probability.homeWin * 100);
  const drawPercent = Math.round(probability.draw * 100);
  const awayPercent = Math.round(probability.awayWin * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>胜平负概率</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 概率条 */}
        <div className="h-8 flex rounded-full overflow-hidden">
          <div
            className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${homePercent}%` }}
          >
            {homePercent > 10 && `${homePercent}%`}
          </div>
          <div
            className="bg-yellow-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${drawPercent}%` }}
          >
            {drawPercent > 10 && `${drawPercent}%`}
          </div>
          <div
            className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${awayPercent}%` }}
          >
            {awayPercent > 10 && `${awayPercent}%`}
          </div>
        </div>

        {/* 图例 */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium">{homeTeam}</span>
            </div>
            <p className="text-2xl font-bold text-green-500">{homePercent}%</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm font-medium">平局</span>
            </div>
            <p className="text-2xl font-bold text-yellow-500">{drawPercent}%</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm font-medium">{awayTeam}</span>
            </div>
            <p className="text-2xl font-bold text-red-500">{awayPercent}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
