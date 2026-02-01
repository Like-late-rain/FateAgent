import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Check, 
  Sparkles,
  Crown,
  Star,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

interface PricingPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  popular?: boolean;
  icon: typeof Zap;
  features: string[];
}

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: PricingPlan[] = [
    {
      id: "starter",
      name: "体验包",
      credits: 5,
      price: 9.9,
      pricePerCredit: 1.98,
      icon: Zap,
      features: [
        "5次分析机会",
        "完整分析报告",
        "历史记录保存",
        "7天有效期",
      ],
    },
    {
      id: "standard",
      name: "标准包",
      credits: 20,
      price: 29.9,
      pricePerCredit: 1.50,
      popular: true,
      icon: Star,
      features: [
        "20次分析机会",
        "完整分析报告",
        "历史记录保存",
        "30天有效期",
        "优先客服支持",
      ],
    },
    {
      id: "pro",
      name: "专业包",
      credits: 50,
      price: 59.9,
      pricePerCredit: 1.20,
      icon: Crown,
      features: [
        "50次分析机会",
        "完整分析报告",
        "历史记录保存",
        "90天有效期",
        "优先客服支持",
        "专属分析建议",
      ],
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>简单透明的定价</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            购买分析次数
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            按需购买，无隐藏费用。选择适合您的次数包，立即开始专业分析
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`glass-card relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer ${
                selectedPlan === plan.id ? "ring-2 ring-primary" : ""
              } ${plan.popular ? "md:-translate-y-4" : ""}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />
              )}
              {plan.popular && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  最受欢迎
                </Badge>
              )}
              <CardHeader className="text-center pb-2">
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                  plan.popular ? "bg-gradient-primary" : "bg-secondary"
                }`}>
                  <plan.icon className={`w-7 h-7 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`} />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>
                  {plan.credits} 次分析
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">¥{plan.price}</span>
                  <div className="text-sm text-muted-foreground mt-1">
                    约 ¥{plan.pricePerCredit.toFixed(2)} / 次
                  </div>
                </div>

                <ul className="space-y-3 mb-6 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.popular ? "gradient" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  {selectedPlan === plan.id ? "已选择" : "选择此套餐"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Purchase Button */}
        {selectedPlan && (
          <div className="max-w-md mx-auto text-center mb-12">
            <Button variant="hero" size="xl" className="w-full gap-2">
              <ShieldCheck className="w-5 h-5" />
              确认购买
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              支持微信支付 · 安全加密 · 即时到账
            </p>
          </div>
        )}

        {/* FAQ / Info */}
        <div className="max-w-3xl mx-auto">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                购买须知
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>每次生成完整分析结果即扣除1次分析机会</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>因系统异常未生成结果，不扣除次数</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>次数一经使用，不支持退款或回退</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>本服务为内测/体验性质，平台可随时调整或终止服务</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>分析结果仅供娱乐与学习参考，不构成任何投注建议</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
