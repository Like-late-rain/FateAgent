'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useCredits } from '@/hooks/useCredits';
import { DEFAULT_DISCLAIMER } from '@/utils/constants';

export default function AnalysisPage() {
  const creditsQuery = useCredits();
  const { state, submit, reset } = useAnalysis();
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [competition, setCompetition] = useState('');
  const [matchDate, setMatchDate] = useState('');

  const remainingCredits = creditsQuery.data?.data?.remainingCredits ?? 0;
  const hasCredits = remainingCredits > 0;

  return (
    <div className="space-y-6">
      <Card title="创建分析" description="填写比赛信息以生成分析结果。">
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            submit({ homeTeam, awayTeam, competition, matchDate });
          }}
        >
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            主队
            <input
              value={homeTeam}
              onChange={(event) => setHomeTeam(event.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            客队
            <input
              value={awayTeam}
              onChange={(event) => setAwayTeam(event.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            赛事
            <input
              value={competition}
              onChange={(event) => setCompetition(event.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            日期
            <input
              type="date"
              value={matchDate}
              onChange={(event) => setMatchDate(event.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2"
              required
            />
          </label>
          <div className="md:col-span-2 flex flex-wrap items-center gap-4">
            <PrimaryButton type="submit" disabled={!hasCredits || state.status === 'submitting'}>
              {state.status === 'submitting' ? '提交中...' : '提交分析'}
            </PrimaryButton>
            {!hasCredits ? (
              <p className="text-sm text-red-500">剩余次数不足，请先购买。</p>
            ) : null}
            <button type="button" className="text-sm text-slate-500" onClick={reset}>
              重置
            </button>
          </div>
        </form>
      </Card>
      <Card title="分析状态" description="查看分析处理进度与结果。">
        {state.status === 'idle' ? <p className="text-sm text-slate-500">等待提交分析。</p> : null}
        {state.status === 'submitting' ? <p className="text-sm text-slate-500">正在提交分析请求...</p> : null}
        {state.status === 'processing' ? (
          <p className="text-sm text-slate-500">分析处理中，请稍候。</p>
        ) : null}
        {state.status === 'error' ? <p className="text-sm text-red-500">{state.message}</p> : null}
        {state.status === 'completed' ? (
          <div className="space-y-4 text-sm text-slate-700">
            <p>
              预测结果：<span className="font-semibold text-slate-900">{state.result.result?.prediction}</span>
            </p>
            <p>置信度：{state.result.result?.confidence}</p>
            <p>{state.result.result?.analysis}</p>
            <div>
              <p className="font-semibold text-slate-900">关键因素</p>
              <ul className="list-disc pl-5">
                {state.result.result?.factors.map((factor) => (
                  <li key={factor.name}>
                    {factor.name} - {factor.description}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md bg-slate-100 p-4 text-xs text-slate-600 whitespace-pre-line">
              {state.result.disclaimer || DEFAULT_DISCLAIMER}
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
