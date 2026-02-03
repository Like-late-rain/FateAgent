import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-12">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Badge>AI × 足球赛事</Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink md:text-6xl">
            用数据洞察比赛，把复杂预测变成清晰的分析脉络。
          </h1>
          <p className="text-lg text-ink/70">
            FateAgent 聚焦球队状态、关键因素与赛程走势，帮助你建立理性判断，打造更具
            可信度的赛事观察视角。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/analysis">
              <Button>开始分析</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">创建账号</Button>
            </Link>
          </div>
        </div>
        <Card className="flex flex-col gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-ink/50">
              今日焦点
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold">
              多维度模型，快速生成可信结果
            </h2>
          </div>
          <div className="space-y-4 text-sm text-ink/70">
            <p>· 历史对战、伤停、主客场等因素权重可视化</p>
            <p>· 支持多赛事和自定义日期，持续跟踪分析</p>
            <p>· 结果明确包含不确定性提示与免责声明</p>
          </div>
        </Card>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: '可追溯分析因子',
            desc: '把影响比赛走势的关键变量结构化呈现。'
          },
          {
            title: '即时信用次数',
            desc: '剩余次数实时展示，使用与购买流程透明。'
          },
          {
            title: '专业免责声明',
            desc: '输出始终保持理性表达，避免误导性表述。'
          }
        ].map((item) => (
          <Card key={item.title} className="h-full">
            <h3 className="font-display text-xl font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm text-ink/70">{item.desc}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
