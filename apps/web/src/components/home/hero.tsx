import Link from 'next/link';
import { BadgeCheck, LineChart, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HomeHero() {
  return (
    <section className="text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-4 py-2 text-xs text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        AI 驱动的足球赛事分析
      </div>
      <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
        让 <span className="text-primary">数据</span> 助你
        <span className="text-amber-400">洞察</span> 比赛
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
        基于深度学习的足球赛事智能分析系统，为您提供专业的比赛预测、战术解读与数据洞察，让每一次决策都有据可依。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/dashboard/analysis">
          <Button size="lg">开始分析</Button>
        </Link>
        <Link href="/pricing">
          <Button size="lg" variant="outline">
            查看价格
          </Button>
        </Link>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-primary" />
          无需订阅，按次付费
        </span>
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          数据安全保障
        </span>
        <span className="flex items-center gap-2">
          <LineChart className="h-4 w-4 text-primary" />
          专业分析模型
        </span>
      </div>
    </section>
  );
}
