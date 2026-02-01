import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  BarChart3, 
  ChevronRight,
  CheckCircle2,
  Target,
  Brain,
  Clock
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI 智能分析",
      description: "基于机器学习算法，深度分析历史数据与实时动态",
    },
    {
      icon: BarChart3,
      title: "多维度数据",
      description: "球队实力、近期表现、伤停信息、历史交锋全覆盖",
    },
    {
      icon: Target,
      title: "精准预测",
      description: "胜负、大小球、让球盘口等多种预测维度",
    },
    {
      icon: Clock,
      title: "即时响应",
      description: "秒级出结果，不错过任何一场重要比赛",
    },
  ];

  const howItWorks = [
    { step: 1, title: "输入比赛", description: "选择您想分析的足球比赛" },
    { step: 2, title: "AI 分析", description: "智能算法深度解析比赛数据" },
    { step: 3, title: "获取报告", description: "查看详细预测与分析理由" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-in">
              <Zap className="w-4 h-4" />
              <span>AI 驱动的足球赛事分析</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight animate-slide-up">
              让 <span className="text-gradient-primary">数据</span> 助你
              <br />
              <span className="text-gradient-accent">洞察</span> 比赛
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
              基于深度学习的足球赛事智能分析系统，为您提供专业的比赛预测、
              战术解读与数据洞察，让每一次决策都有据可依。
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              <Link to="/analyze">
                <Button variant="hero" size="xl" className="gap-2">
                  开始分析
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="xl" className="gap-2">
                  查看价格
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>无需订阅，按次付费</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>数据安全保障</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>专业分析模型</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              为什么选择足球智析？
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              我们将AI技术与足球大数据深度融合，为您提供全方位的赛事分析服务
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="glass-card glow-border group hover:scale-105 transition-all duration-300"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              简单三步，获取专业分析
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              无需复杂操作，即可获得深度赛事洞察
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative text-center">
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/10" />
                )}
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/analyze">
              <Button variant="gradient" size="lg" className="gap-2">
                立即体验
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="py-8 bg-secondary/50 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4 max-w-4xl mx-auto">
            <Shield className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">免责声明</h4>
              <p className="text-sm text-muted-foreground">
                本产品所提供的足球赛事分析内容，基于公开数据、统计模型及智能分析生成，
                仅供娱乐与学习参考。不构成任何形式的投注、下注、投资或实际决策建议。
                用户应自行承担因使用本产品所产生的一切风险。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card max-w-4xl mx-auto p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                准备好开始了吗？
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                注册账号，购买分析次数，即可获取专业的足球赛事AI分析报告
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button variant="hero" size="xl" className="gap-2">
                    免费注册
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg">
                    了解更多
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
