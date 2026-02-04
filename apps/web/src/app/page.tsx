import Link from 'next/link';
import {
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  Clock3,
  LineChart,
  ShieldCheck,
  Sparkles,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

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

export default function HomePage() {
  return (
    <div className="grid-overlay">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
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
            <Link href="/dashboard/purchase">
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

        <section className="text-center">
          <h2 className="text-2xl font-semibold">简单三步，获取专业分析</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            无需复杂操作，即可获得深度赛事洞察
          </p>
          <div className="mt-8 flex flex-col items-center gap-10 md:flex-row md:justify-between">
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

        <section className="rounded-2xl border border-border/70 bg-card/80 p-10 text-center">
          <h3 className="text-2xl font-semibold">准备好开始了吗？</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            注册账号，购买分析次数，即可获取专业的足球赛事 AI 分析报告
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg">免费注册</Button>
            </Link>
            <Link href="/dashboard/purchase">
              <Button size="lg" variant="outline">
                了解更多
              </Button>
            </Link>
          </div>
        </section>

        <footer className="border-t border-border/60 pt-10 text-sm text-muted-foreground">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
                  ⚽️
                </span>
                足球智析
              </div>
              <p>
                基于 AI 的足球赛事分析平台，为您提供专业的比赛预测与数据解析服务。
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-foreground">快速链接</p>
              <ul className="space-y-2">
                <li>赛事分析</li>
                <li>历史记录</li>
                <li>购买次数</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-foreground">法律条款</p>
              <ul className="space-y-2">
                <li>用户协议</li>
                <li>隐私政策</li>
                <li>免责声明</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-foreground">联系我们</p>
              <p>客服邮箱：support@zuqiuzhixi.com</p>
              <p>工作时间：周一至周五 9:00-18:00</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span>© 2026 足球智析. 保留所有权利.</span>
            <span>免责声明：本产品分析内容仅供娱乐与学习参考，不构成投注建议。</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
