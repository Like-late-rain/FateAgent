import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Loader2, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  MapPin,
  Users,
  BarChart3,
  AlertCircle,
  Sparkles
} from "lucide-react";

interface AnalysisResult {
  homeTeam: string;
  awayTeam: string;
  prediction: {
    winner: "home" | "away" | "draw";
    confidence: number;
    score: string;
  };
  analysis: {
    homeStrength: number;
    awayStrength: number;
    homeForm: string;
    awayForm: string;
    headToHead: string;
    keyFactors: string[];
  };
  odds: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
}

const Analyze = () => {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [competition, setCompetition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [remainingCredits] = useState(10); // 模拟剩余次数

  const handleAnalyze = async () => {
    if (!homeTeam || !awayTeam) return;
    
    setIsLoading(true);
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 模拟分析结果
    const mockResult: AnalysisResult = {
      homeTeam,
      awayTeam,
      prediction: {
        winner: "home",
        confidence: 72,
        score: "2-1",
      },
      analysis: {
        homeStrength: 85,
        awayStrength: 78,
        homeForm: "W-W-D-W-L",
        awayForm: "D-L-W-W-D",
        headToHead: "近5次交锋：主队3胜1平1负",
        keyFactors: [
          "主队近期状态火热，近5场4胜",
          "客队核心中场因伤缺阵",
          "主队主场优势明显，主场胜率达75%",
          "历史交锋主队占优",
        ],
      },
      odds: {
        homeWin: 1.85,
        draw: 3.60,
        awayWin: 4.20,
      },
    };
    
    setResult(mockResult);
    setIsLoading(false);
  };

  const getPredictionBadge = (winner: "home" | "away" | "draw") => {
    switch (winner) {
      case "home":
        return <Badge className="bg-primary/20 text-primary border-primary/30">主胜</Badge>;
      case "away":
        return <Badge className="bg-accent/20 text-accent border-accent/30">客胜</Badge>;
      case "draw":
        return <Badge className="bg-muted text-muted-foreground border-border">平局</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            赛事分析
          </h1>
          <p className="text-muted-foreground mb-4">
            输入比赛信息，获取AI智能分析报告
          </p>
          {/* Credits Display */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm">
              剩余分析次数：<span className="font-bold text-primary">{remainingCredits}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                比赛信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeTeam">主队</Label>
                  <Input
                    id="homeTeam"
                    placeholder="例：曼联"
                    value={homeTeam}
                    onChange={(e) => setHomeTeam(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="awayTeam">客队</Label>
                  <Input
                    id="awayTeam"
                    placeholder="例：利物浦"
                    value={awayTeam}
                    onChange={(e) => setAwayTeam(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matchDate">比赛日期（可选）</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="matchDate"
                      type="date"
                      value={matchDate}
                      onChange={(e) => setMatchDate(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competition">赛事（可选）</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="competition"
                      placeholder="例：英超"
                      value={competition}
                      onChange={(e) => setCompetition(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleAnalyze} 
                disabled={!homeTeam || !awayTeam || isLoading}
                variant="gradient"
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    分析中...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    开始分析（消耗1次）
                  </>
                )}
              </Button>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  分析结果仅供娱乐与学习参考，不构成任何投注建议。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {isLoading ? (
              <Card className="glass-card">
                <CardContent className="py-20 text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">AI 正在分析比赛数据...</p>
                </CardContent>
              </Card>
            ) : result ? (
              <>
                {/* Prediction Card */}
                <Card className="glass-card overflow-hidden">
                  <div className="h-2 bg-gradient-primary" />
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>预测结果</span>
                      {getPredictionBadge(result.prediction.winner)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground mb-1">
                          {result.homeTeam}
                        </div>
                        <div className="text-sm text-muted-foreground">主队</div>
                      </div>
                      <div className="text-center px-6">
                        <div className="text-4xl font-bold text-gradient-primary">
                          {result.prediction.score}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">预测比分</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground mb-1">
                          {result.awayTeam}
                        </div>
                        <div className="text-sm text-muted-foreground">客队</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/10">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span className="font-semibold">
                        置信度：{result.prediction.confidence}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Details */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      详细分析
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Strength Comparison */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>主队实力</span>
                        <span className="font-mono">{result.analysis.homeStrength}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-primary transition-all duration-500"
                          style={{ width: `${result.analysis.homeStrength}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>客队实力</span>
                        <span className="font-mono">{result.analysis.awayStrength}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-accent transition-all duration-500"
                          style={{ width: `${result.analysis.awayStrength}%` }}
                        />
                      </div>
                    </div>

                    {/* Form */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-secondary/50">
                        <div className="text-xs text-muted-foreground mb-1">主队近期</div>
                        <div className="font-mono text-sm flex gap-1">
                          {result.analysis.homeForm.split("-").map((r, i) => (
                            <span 
                              key={i}
                              className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                r === "W" ? "bg-primary/20 text-primary" :
                                r === "L" ? "bg-destructive/20 text-destructive" :
                                "bg-muted text-muted-foreground"
                              }`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50">
                        <div className="text-xs text-muted-foreground mb-1">客队近期</div>
                        <div className="font-mono text-sm flex gap-1">
                          {result.analysis.awayForm.split("-").map((r, i) => (
                            <span 
                              key={i}
                              className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                r === "W" ? "bg-primary/20 text-primary" :
                                r === "L" ? "bg-destructive/20 text-destructive" :
                                "bg-muted text-muted-foreground"
                              }`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Key Factors */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3">关键因素</h4>
                      <ul className="space-y-2">
                        {result.analysis.keyFactors.map((factor, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Odds */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3">参考赔率</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-secondary/50 text-center">
                          <div className="text-xs text-muted-foreground mb-1">主胜</div>
                          <div className="font-mono font-bold text-primary">{result.odds.homeWin}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50 text-center">
                          <div className="text-xs text-muted-foreground mb-1">平局</div>
                          <div className="font-mono font-bold">{result.odds.draw}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50 text-center">
                          <div className="text-xs text-muted-foreground mb-1">客胜</div>
                          <div className="font-mono font-bold text-accent">{result.odds.awayWin}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="glass-card">
                <CardContent className="py-20 text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">输入比赛信息后，AI将为您生成详细分析报告</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analyze;
