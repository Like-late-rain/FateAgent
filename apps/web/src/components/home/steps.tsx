import Link from 'next/link';
import { LineChart, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    title: '输入比赛',
    desc: '选择您想分析的足球比赛',
    icon: LineChart
  },
  {
    title: 'AI 分析',
    desc: '智能算法深度解析比赛数据',
    icon: Sparkles
  },
  {
    title: '获取报告',
    desc: '查看详细预测与分析理由',
    icon: ShieldCheck
  }
];

export function HomeSteps() {
  return (
    <section className="text-center">
      <h2 className="text-2xl font-semibold">简单三步，获取专业分析</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        无需复杂操作，即可获得深度赛事洞察
      </p>
      <div className="relative mt-8 flex flex-col items-center gap-10 md:flex-row md:justify-between">
        <div className="absolute left-1/2 top-7 hidden h-px w-full -translate-x-1/2 bg-primary/20 md:block" />
        {steps.map((step, index) => (
          <div key={step.title} className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <span className="text-lg font-semibold">{index + 1}</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/60 text-primary">
              <step.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-semibold">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Link href="/dashboard/analysis">
          <Button size="lg">立即体验</Button>
        </Link>
      </div>
    </section>
  );
}
