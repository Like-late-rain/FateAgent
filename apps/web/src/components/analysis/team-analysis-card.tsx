'use client';

import type { TeamAnalysis } from '@fateagent/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamAnalysisCardProps {
  team: TeamAnalysis;
  label: '主队' | '客队';
}

export function TeamAnalysisCard({ team, label }: TeamAnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
            {label}
          </span>
          {team.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 排名和状态 */}
        <div className="grid grid-cols-2 gap-4 text-center">
          {team.position && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">联赛排名</p>
              <p className="text-2xl font-bold">第 {team.position} 位</p>
            </div>
          )}
          {team.form && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">近期状态</p>
              <div className="flex justify-center gap-1 mt-1">
                {team.form.split('').map((result, i) => (
                  <span
                    key={i}
                    className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                      result === 'W'
                        ? 'bg-green-500 text-white'
                        : result === 'D'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {result}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 战绩 */}
        {(team.played !== undefined && team.played > 0) && (
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            <div className="p-2 bg-muted rounded">
              <p className="text-muted-foreground">场次</p>
              <p className="font-bold">{team.played}</p>
            </div>
            <div className="p-2 bg-green-500/10 rounded">
              <p className="text-green-600">胜</p>
              <p className="font-bold text-green-600">{team.won}</p>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded">
              <p className="text-yellow-600">平</p>
              <p className="font-bold text-yellow-600">{team.draw}</p>
            </div>
            <div className="p-2 bg-red-500/10 rounded">
              <p className="text-red-600">负</p>
              <p className="font-bold text-red-600">{team.lost}</p>
            </div>
          </div>
        )}

        {/* 进球/失球 */}
        {(team.goalsFor !== undefined || team.goalsAgainst !== undefined) && (
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">进球</p>
              <p className="text-xl font-bold text-green-500">{team.goalsFor ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">失球</p>
              <p className="text-xl font-bold text-red-500">{team.goalsAgainst ?? 0}</p>
            </div>
          </div>
        )}

        {/* 伤病 */}
        {team.injuries && team.injuries.length > 0 && (
          <div>
            <p className="text-sm font-medium text-red-500 mb-2">伤病名单</p>
            <div className="flex flex-wrap gap-2">
              {team.injuries.map((player, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-red-500/10 text-red-500 rounded"
                >
                  {player}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 关键新闻 */}
        {team.keyNews && team.keyNews.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">最新动态</p>
            <div className="space-y-1">
              {team.keyNews.map((news, i) => (
                <p key={i} className="text-xs text-muted-foreground">
                  • {news}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
