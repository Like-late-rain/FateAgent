import { useState } from 'react';
import type { ParsedMatchInfo, AnalysisRequest } from '@fateagent/shared-types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import type { ParseState } from '@/hooks/use-parse-query';
import type { AnalysisPageState } from '@/hooks/use-analysis-flow';

const EXAMPLE_QUERIES = [
  '帮我分析2026年美加墨世界杯，6月11号小组赛墨西哥vs南非的结果',
  '英超曼城vs利物浦2026年3月15号',
  '2026欧冠半决赛皇马对阵拜仁',
];

interface AnalysisFormProps {
  credits: number;
  isLoading: boolean;
  isError: boolean;
  parseState: ParseState;
  analysisState: AnalysisPageState;
  onParse: (query: string) => void;
  onConfirm: (data: AnalysisRequest) => void;
  onReset: () => void;
  onEditParsed: (parsed: ParsedMatchInfo) => void;
}

export function AnalysisForm({
  credits,
  isLoading,
  isError,
  parseState,
  analysisState,
  onParse,
  onConfirm,
  onReset,
  onEditParsed,
}: AnalysisFormProps) {
  const [query, setQuery] = useState('');

  const handleParse = (e: React.FormEvent) => {
    e.preventDefault();
    onParse(query);
  };

  const handleConfirm = () => {
    if (parseState.status === 'parsed') {
      const { homeTeam, awayTeam, competition, matchDate } = parseState.parsed;
      onConfirm({ homeTeam, awayTeam, competition, matchDate });
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    onParse(example);
  };

  const canParse = credits > 0 && !isLoading && !isError && query.trim().length > 0;
  const isParsing = parseState.status === 'parsing';
  const isAnalyzing = analysisState.status === 'submitting' || analysisState.status === 'processing';
  const showResult = analysisState.status === 'completed' || analysisState.status === 'error';

  return (
    <Card>
      <CardContent className="space-y-4">
        {/* 剩余次数 */}
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

        {/* 步骤1: 自然语言输入 */}
        {parseState.status !== 'parsed' && !showResult && (
          <>
            <form onSubmit={handleParse} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">描述您想分析的比赛</label>
                <Input
                  placeholder="例如：帮我分析2026年美加墨世界杯，6月11号小组赛墨西哥vs南非的结果"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isParsing}
                  className="h-12"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={!canParse || isParsing}>
                  {isParsing ? '解析中...' : '解析比赛信息'}
                </Button>
              </div>
            </form>

            {/* 示例查询 */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">示例查询：</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_QUERIES.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleExampleClick(example)}
                    className="text-xs px-3 py-1.5 bg-background border rounded-full hover:bg-accent transition-colors"
                    disabled={isParsing}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* 解析错误 */}
            {parseState.status === 'error' && (
              <ErrorMessage message={parseState.message} />
            )}
          </>
        )}

        {/* 步骤2: 确认解析结果 */}
        {parseState.status === 'parsed' && !showResult && (
          <ConfirmationCard
            parsed={parseState.parsed}
            onConfirm={handleConfirm}
            onEdit={onEditParsed}
            onBack={() => onReset()}
            isSubmitting={isAnalyzing}
          />
        )}

        {/* 分析中/完成后显示重新开始按钮 */}
        {(isAnalyzing || showResult) && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={onReset}>
              重新开始
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ConfirmationCardProps {
  parsed: ParsedMatchInfo;
  onConfirm: () => void;
  onEdit: (parsed: ParsedMatchInfo) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

function ConfirmationCard({
  parsed,
  onConfirm,
  onEdit,
  onBack,
  isSubmitting,
}: ConfirmationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(parsed);

  const handleSaveEdit = () => {
    onEdit(editForm);
    setIsEditing(false);
  };

  const confidencePercent = Math.round(parsed.confidence * 100);
  const confidenceColor =
    parsed.confidence >= 0.8
      ? 'text-green-600'
      : parsed.confidence >= 0.5
        ? 'text-yellow-600'
        : 'text-red-600';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">请确认比赛信息</h3>
        <span className={`text-sm ${confidenceColor}`}>
          解析置信度: {confidencePercent}%
        </span>
      </div>

      {!isEditing ? (
        <div className="grid gap-3 p-4 bg-muted/50 rounded-lg">
          <InfoRow label="主队" value={parsed.homeTeam} />
          <InfoRow label="客队" value={parsed.awayTeam} />
          <InfoRow label="赛事" value={parsed.competition} />
          <InfoRow label="比赛日期" value={formatDate(parsed.matchDate)} />
        </div>
      ) : (
        <div className="grid gap-3 p-4 bg-muted/50 rounded-lg">
          <EditRow
            label="主队"
            value={editForm.homeTeam}
            onChange={(v) => setEditForm({ ...editForm, homeTeam: v })}
          />
          <EditRow
            label="客队"
            value={editForm.awayTeam}
            onChange={(v) => setEditForm({ ...editForm, awayTeam: v })}
          />
          <EditRow
            label="赛事"
            value={editForm.competition}
            onChange={(v) => setEditForm({ ...editForm, competition: v })}
          />
          <div className="flex items-center gap-3">
            <span className="w-20 text-sm text-muted-foreground">比赛日期</span>
            <Input
              type="date"
              value={editForm.matchDate}
              onChange={(e) => setEditForm({ ...editForm, matchDate: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {!isEditing ? (
          <>
            <Button onClick={onConfirm} disabled={isSubmitting}>
              {isSubmitting ? '分析中...' : '确认并开始分析'}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(true)} disabled={isSubmitting}>
              修改信息
            </Button>
            <Button variant="ghost" onClick={onBack} disabled={isSubmitting}>
              返回重新输入
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleSaveEdit}>保存修改</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              取消
            </Button>
          </>
        )}
      </div>

      {parsed.confidence < 0.8 && (
        <p className="text-sm text-muted-foreground">
          提示：解析置信度较低，请仔细检查以上信息是否正确。
        </p>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function EditRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-sm text-muted-foreground">{label}</span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
