import { ShieldCheck } from 'lucide-react';

export function HomeDisclaimer() {
  return (
    <section className="rounded-2xl border border-border/70 bg-secondary/40 px-6 py-5 text-sm text-muted-foreground">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-400" />
        <div>
          <p className="font-semibold text-foreground">免责声明</p>
          <p>
            本产品所提供的足球赛事分析内容，基于公开数据、统计模型及智能分析生成，仅供娱乐与学习参考，
            不构成任何形式的投注、下注、投资或实际决策建议。用户应自行承担使用本产品所产生的一切风险。
          </p>
        </div>
      </div>
    </section>
  );
}
