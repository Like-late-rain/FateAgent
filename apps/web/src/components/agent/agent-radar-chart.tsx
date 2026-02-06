'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AgentRadarChartProps {
  metrics: {
    outcomeAccuracy: number;
    exactScoreAccuracy: number;
    scoreInTop5Rate: number;
    overUnderAccuracy: number;
    bothTeamsScoreAccuracy: number;
    homeWinAccuracy: number;
    drawAccuracy: number;
    awayWinAccuracy: number;
  };
}

export function AgentRadarChart({ metrics }: AgentRadarChartProps) {
  // 准备雷达图数据（转换为百分比）
  const data = [
    {
      ability: '胜负预测',
      value: metrics.outcomeAccuracy * 100,
      fullMark: 100
    },
    {
      ability: '精确比分',
      value: metrics.exactScoreAccuracy * 100,
      fullMark: 100
    },
    {
      ability: 'TOP5命中',
      value: metrics.scoreInTop5Rate * 100,
      fullMark: 100
    },
    {
      ability: '大小球',
      value: metrics.overUnderAccuracy * 100,
      fullMark: 100
    },
    {
      ability: '双方进球',
      value: metrics.bothTeamsScoreAccuracy * 100,
      fullMark: 100
    },
    {
      ability: '主胜判断',
      value: metrics.homeWinAccuracy * 100,
      fullMark: 100
    }
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="ability" />
        <PolarRadiusAxis angle={90} domain={[0, 100]} />
        <Radar
          name="准确率 (%)"
          dataKey="value"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.6}
        />
        <Legend />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">
                      {payload[0].payload.ability}:
                    </span>
                    <span className="font-bold text-right">
                      {payload[0].value?.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
