import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  History as HistoryIcon, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";

interface HistoryItem {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  date: string;
  prediction: "home" | "away" | "draw";
  predictedScore: string;
  confidence: number;
  actualResult?: string;
  isCorrect?: boolean;
}

const History = () => {
  // 模拟历史数据
  const historyData: HistoryItem[] = [
    {
      id: "1",
      homeTeam: "曼联",
      awayTeam: "利物浦",
      competition: "英超",
      date: "2026-01-28",
      prediction: "home",
      predictedScore: "2-1",
      confidence: 72,
      actualResult: "2-1",
      isCorrect: true,
    },
    {
      id: "2",
      homeTeam: "巴塞罗那",
      awayTeam: "皇家马德里",
      competition: "西甲",
      date: "2026-01-25",
      prediction: "draw",
      predictedScore: "1-1",
      confidence: 65,
      actualResult: "2-2",
      isCorrect: true,
    },
    {
      id: "3",
      homeTeam: "拜仁慕尼黑",
      awayTeam: "多特蒙德",
      competition: "德甲",
      date: "2026-01-22",
      prediction: "home",
      predictedScore: "3-1",
      confidence: 78,
      actualResult: "1-2",
      isCorrect: false,
    },
    {
      id: "4",
      homeTeam: "AC米兰",
      awayTeam: "国际米兰",
      competition: "意甲",
      date: "2026-01-20",
      prediction: "away",
      predictedScore: "1-2",
      confidence: 68,
    },
    {
      id: "5",
      homeTeam: "巴黎圣日耳曼",
      awayTeam: "里昂",
      competition: "法甲",
      date: "2026-01-18",
      prediction: "home",
      predictedScore: "3-0",
      confidence: 85,
    },
  ];

  const getPredictionBadge = (prediction: "home" | "away" | "draw") => {
    switch (prediction) {
      case "home":
        return <Badge className="bg-primary/20 text-primary border-primary/30">主胜</Badge>;
      case "away":
        return <Badge className="bg-accent/20 text-accent border-accent/30">客胜</Badge>;
      case "draw":
        return <Badge className="bg-muted text-muted-foreground border-border">平局</Badge>;
    }
  };

  const getResultBadge = (isCorrect?: boolean) => {
    if (isCorrect === undefined) {
      return <Badge variant="outline" className="text-muted-foreground">待验证</Badge>;
    }
    return isCorrect ? (
      <Badge className="bg-success/20 text-success border-success/30">正确</Badge>
    ) : (
      <Badge className="bg-destructive/20 text-destructive border-destructive/30">错误</Badge>
    );
  };

  // 统计数据
  const totalPredictions = historyData.length;
  const verifiedPredictions = historyData.filter(h => h.isCorrect !== undefined);
  const correctPredictions = verifiedPredictions.filter(h => h.isCorrect).length;
  const accuracy = verifiedPredictions.length > 0 
    ? Math.round((correctPredictions / verifiedPredictions.length) * 100) 
    : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            历史记录
          </h1>
          <p className="text-muted-foreground">
            查看您的分析记录与预测准确率
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          <div className="stat-card text-center">
            <div className="stat-value text-primary">{totalPredictions}</div>
            <div className="stat-label">总分析次数</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-value text-success">{correctPredictions}</div>
            <div className="stat-label">预测正确</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-value text-accent">{accuracy}%</div>
            <div className="stat-label">准确率</div>
          </div>
        </div>

        {/* History List */}
        {historyData.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {historyData.map((item) => (
              <Card key={item.id} className="glass-card hover:scale-[1.01] transition-transform">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Match Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{item.date}</span>
                        <Badge variant="outline" className="ml-2">{item.competition}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground">{item.homeTeam}</span>
                        <span className="text-muted-foreground">vs</span>
                        <span className="font-semibold text-foreground">{item.awayTeam}</span>
                      </div>
                    </div>

                    {/* Prediction */}
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">预测</div>
                        <div className="flex items-center gap-2">
                          {getPredictionBadge(item.prediction)}
                          <span className="font-mono font-semibold">{item.predictedScore}</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">置信度</div>
                        <div className="font-mono font-semibold text-primary">{item.confidence}%</div>
                      </div>

                      {item.actualResult && (
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">实际</div>
                          <div className="font-mono font-semibold">{item.actualResult}</div>
                        </div>
                      )}

                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">结果</div>
                        {getResultBadge(item.isCorrect)}
                      </div>

                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass-card max-w-md mx-auto">
            <CardContent className="py-16 text-center">
              <HistoryIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">暂无分析记录</h3>
              <p className="text-muted-foreground mb-6">开始您的第一次赛事分析吧！</p>
              <Link to="/analyze">
                <Button variant="gradient" className="gap-2">
                  开始分析
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default History;
