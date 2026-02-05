'use client';

import type { GoalsPrediction as GoalsPredictionType } from '@fateagent/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GoalsPredictionProps {
  prediction: GoalsPredictionType;
}

export function GoalsPrediction({ prediction }: GoalsPredictionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>进球预测</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 预期进球 */}
        <div className="grid grid-cols-2 gap-4 text-center p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">主队预期进球</p>
            <p className="text-3xl font-bold text-primary">
              {prediction.homeGoalsExpected.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">客队预期进球</p>
            <p className="text-3xl font-bold text-primary">
              {prediction.awayGoalsExpected.toFixed(1)}
            </p>
          </div>
        </div>

        {/* 进球数预测 */}
        <div className="space-y-3">
          <PredictionBar
            label="大 2.5 球"
            probability={prediction.totalOver2_5}
            color="bg-green-500"
          />
          <PredictionBar
            label="小 2.5 球"
            probability={prediction.totalUnder2_5}
            color="bg-orange-500"
          />
          <PredictionBar
            label="双方都进球"
            probability={prediction.bothTeamsScore}
            color="bg-blue-500"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function PredictionBar({
  label,
  probability,
  color
}: {
  label: string;
  probability: number;
  color: string;
}) {
  const percent = Math.round(probability * 100);

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-medium">{percent}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
