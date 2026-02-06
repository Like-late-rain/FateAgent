'use client';

interface AgentStatsGridProps {
  metrics: {
    outcomeAccuracy: number;
    homeWinAccuracy: number;
    drawAccuracy: number;
    awayWinAccuracy: number;
    exactScoreAccuracy: number;
    scoreInTop5Rate: number;
    overUnderAccuracy: number;
    bothTeamsScoreAccuracy: number;
  };
}

export function AgentStatsGrid({ metrics }: AgentStatsGridProps) {
  const stats = [
    {
      category: '胜负预测',
      items: [
        { label: '总体准确率', value: metrics.outcomeAccuracy },
        { label: '主胜判断', value: metrics.homeWinAccuracy },
        { label: '平局判断', value: metrics.drawAccuracy },
        { label: '客胜判断', value: metrics.awayWinAccuracy }
      ]
    },
    {
      category: '比分预测',
      items: [
        { label: '精确比分命中', value: metrics.exactScoreAccuracy },
        { label: 'TOP 5 命中率', value: metrics.scoreInTop5Rate }
      ]
    },
    {
      category: '进球数预测',
      items: [
        { label: '大小球准确率', value: metrics.overUnderAccuracy },
        { label: '双方进球准确率', value: metrics.bothTeamsScoreAccuracy }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {stats.map((section) => (
        <div key={section.category}>
          <h4 className="font-semibold mb-3">{section.category}</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {section.items.map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center p-3 rounded-lg border bg-muted/50"
              >
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{(item.value * 100).toFixed(1)}%</span>
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${item.value * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
