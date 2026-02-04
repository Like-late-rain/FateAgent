import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HomeCta() {
  return (
    <section className="rounded-2xl border border-border/70 bg-card/80 p-10 text-center">
      <h3 className="text-2xl font-semibold">准备好开始了吗？</h3>
      <p className="mt-3 text-sm text-muted-foreground">
        注册账号，购买分析次数，即可获取专业的足球赛事 AI 分析报告
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Link href="/register">
          <Button size="lg">免费注册</Button>
        </Link>
        <Link href="/pricing">
          <Button size="lg" variant="outline">
            了解更多
          </Button>
        </Link>
      </div>
    </section>
  );
}
