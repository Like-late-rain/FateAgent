import type { UseFormReturn } from 'react-hook-form';
import type { AnalysisRequest } from '@fateagent/shared-types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

export type AnalysisFormState = {
  status: 'idle' | 'submitting' | 'processing' | 'completed' | 'error';
};

interface AnalysisFormProps {
  form: UseFormReturn<AnalysisRequest>;
  onSubmit: () => void;
  onReset: () => void;
  state: AnalysisFormState;
  credits: number;
  canSubmit: boolean;
  isLoading: boolean;
  isError: boolean;
}

export function AnalysisForm({
  form,
  onSubmit,
  onReset,
  state,
  credits,
  canSubmit,
  isLoading,
  isError
}: AnalysisFormProps) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              剩余次数
            </p>
            <p className="text-lg font-semibold">{credits}</p>
          </div>
          {isLoading && <Loading label="读取次数..." />}
          {isError && <ErrorMessage message="次数读取失败" />}
          {!isLoading && !isError && credits === 0 && (
            <span className="text-sm text-destructive">次数不足，请先购买。</span>
          )}
        </div>
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">主队</label>
            <Input placeholder="例如：曼城" {...form.register('homeTeam', { required: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">客队</label>
            <Input placeholder="例如：利物浦" {...form.register('awayTeam', { required: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">赛事</label>
            <Input placeholder="例如：英超" {...form.register('competition', { required: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">比赛日期</label>
            <Input type="date" {...form.register('matchDate', { required: true })} />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button type="submit" disabled={!canSubmit}>
              {state.status === 'submitting' ? '提交中...' : '提交分析'}
            </Button>
            {state.status !== 'idle' && (
              <Button type="button" variant="outline" onClick={onReset}>
                重新开始
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
