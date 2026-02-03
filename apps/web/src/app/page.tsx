import Link from 'next/link';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">FateAgent</p>
        <h1 className="text-4xl font-bold text-slate-900">智能足球赛事分析平台</h1>
        <p className="text-base text-slate-600">
          通过多维度数据分析比赛走势，提供清晰的分析结论与风险提示。
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-3">
        <Card title="专业分析" description="结合历史战绩与近期状态，输出可解释的比赛分析。" />
        <Card title="可视化提示" description="清晰展示主客队因素与置信度，易于理解。" />
        <Card title="合规提示" description="每次分析均包含免责声明与风险说明。" />
      </section>
      <section className="flex flex-wrap gap-4">
        <Link href="/login">
          <PrimaryButton>登录</PrimaryButton>
        </Link>
        <Link href="/register">
          <PrimaryButton className="bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50">
            注册
          </PrimaryButton>
        </Link>
      </section>
    </main>
  );
}
