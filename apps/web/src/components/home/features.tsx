import { BarChart3, BrainCircuit, Clock3, Target } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'AI 智能分析',
    desc: '基于机器学习算法，深度分析历史数据与实时动态。',
    icon: BrainCircuit
  },
  {
    title: '多维度数据',
    desc: '球队实力、近期表现、伤停信息、历史交锋全覆盖。',
    icon: BarChart3
  },
  {
    title: '精准预测',
    desc: '胜负、大小球、让球盘口等多种预测维度。',
    icon: Target
  },
  {
    title: '即时响应',
    desc: '秒级出结果，不错过任何一场重要比赛。',
    icon: Clock3
  }
];

export function HomeFeatures() {
  return (
    <section className="text-center">
      <h2 className="text-2xl font-semibold">为什么选择足球智析？</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        我们将 AI 技术与足球大数据深度融合，为您提供全方位的赛事分析服务
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="text-left">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription>{feature.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
