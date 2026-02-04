import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Badge>AI × 足球赛事</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            用数据洞察比赛，把复杂预测变成清晰的分析脉络。
          </h1>
          <p className="text-lg text-muted-foreground">
            FateAgent 聚焦球队状态、关键因素与赛程走势，帮助你建立理性判断，打造更具可信度的赛事观察视角。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/analysis">
              <Button>开始分析</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">创建账号</Button>
            </Link>
          </div>
        </div>
        <Card>
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              今日焦点
            </p>
            <CardTitle className="text-xl">多维度模型，快速生成可信结果</CardTitle>
            <CardDescription>以结构化因子呈现分析过程。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>· 历史对战、伤停、主客场等因素权重可视化</p>
            <p>· 支持多赛事和自定义日期，持续跟踪分析</p>
            <p>· 结果明确包含不确定性提示与免责声明</p>
          </CardContent>
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
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>{item.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  );
}
