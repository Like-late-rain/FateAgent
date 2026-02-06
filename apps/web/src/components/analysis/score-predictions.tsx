'use client';

import type { ScoreProbability } from '@fateagent/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScorePredictionsProps {
  predictions: ScoreProbability[];
}

export function ScorePredictions({ predictions }: ScorePredictionsProps) {
  // 按概率排序
  const sorted = [...predictions].sort((a, b) => b.probability - a.probability);

  return (
    <Card>
      <CardHeader>
        <CardTitle>比分预测 TOP 5</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sorted.slice(0, 5).map((pred, index) => {
            const percent = Math.round(pred.probability * 100);
            return (
              <div key={pred.score} className="flex items-center gap-4">
                <div className="w-8 text-center">
                  <span
                    className={`text-sm font-bold ${
                      index === 0
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    #{index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg font-mono font-bold">
                      {pred.score}
                    </span>
                    <span className="text-sm font-medium text-primary">
                      {percent}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        index === 0
                          ? 'bg-primary'
                          : 'bg-primary/60'
                      }`}
                      style={{ width: `${percent * 2}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
