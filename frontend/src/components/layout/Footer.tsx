import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-xl">⚽</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                足球<span className="text-gradient-primary">智析</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              基于AI的足球赛事分析平台，为您提供专业的比赛预测与数据解析服务。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/analyze" className="text-muted-foreground hover:text-primary transition-colors">
                  赛事分析
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-muted-foreground hover:text-primary transition-colors">
                  历史记录
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  购买次数
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">法律条款</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  用户协议
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors">
                  免责声明
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">联系我们</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>客服邮箱：support@zuqiuzhixi.com</li>
              <li>工作时间：周一至周五 9:00-18:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 足球智析. 保留所有权利.
          </p>
          <p className="text-xs text-muted-foreground/60 text-center md:text-right max-w-md">
            免责声明：本产品分析内容仅供娱乐与学习参考，不构成任何投注建议。
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
