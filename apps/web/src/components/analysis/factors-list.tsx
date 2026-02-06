'use client';

import type { AnalysisFactor } from '@fateagent/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FactorsListProps {
  factors: AnalysisFactor[];
}

export function FactorsList({ factors }: FactorsListProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'border-green-500 bg-green-500/5';
      case 'negative':
        return 'border-red-500 bg-red-500/5';
      default:
        return 'border-yellow-500 bg-yellow-500/5';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'positive':
        return { text: '利好', color: 'text-green-500' };
      case 'negative':
        return { text: '利空', color: 'text-red-500' };
      default:
        return { text: '中性', color: 'text-yellow-500' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>关键因素分析</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {factors.map((factor, index) => {
            const impactLabel = getImpactLabel(factor.impact);
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${getImpactColor(factor.impact)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{factor.name}</h4>
                  <span className={`text-xs font-medium ${impactLabel.color}`}>
                    {impactLabel.text}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {factor.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
