export function HomeFooter() {
  return (
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
  );
}
