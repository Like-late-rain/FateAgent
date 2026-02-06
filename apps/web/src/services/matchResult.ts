const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * 录入比赛结果
 */
export async function recordMatchResult(
  analysisId: string,
  homeScore: number,
  awayScore: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/match-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        analysisId,
        homeScore,
        awayScore
      })
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.error || '录入失败' };
    }

    return { success: true };
  } catch (error) {
    console.error('[RecordMatchResult] Error:', error);
    return { success: false, error: '网络错误' };
  }
}

/**
 * 获取预测对比结果
 */
export async function getComparisonResult(analysisId: string) {
  const res = await fetch(`${API_URL}/match-results/comparison/${analysisId}`, {
    credentials: 'include'
  });

  if (!res.ok) {
    const data = await res.json();
    throw {
      response: {
        data: {
          error: data.error,
          canCompare: data.canCompare,
          matchDate: data.matchDate
        }
      }
    };
  }

  return res.json();
}

/**
 * 获取 Agent 性能指标
 */
export async function getAgentPerformance() {
  const res = await fetch(`${API_URL}/agent/performance`, {
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('获取失败');
  }

  return res.json();
}
