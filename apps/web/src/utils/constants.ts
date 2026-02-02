export const PRODUCT_OPTIONS = [
  {
    id: 'credits_10',
    name: '体验包',
    credits: 10,
    price: '¥10',
  },
  {
    id: 'credits_30',
    name: '标准包',
    credits: 30,
    price: '¥25',
  },
  {
    id: 'credits_100',
    name: '豪华包',
    credits: 100,
    price: '¥70',
  },
] as const;

export const DASHBOARD_NAV = [
  { href: '/dashboard', label: '概览' },
  { href: '/dashboard/analysis', label: '分析' },
  { href: '/dashboard/history', label: '历史' },
  { href: '/dashboard/purchase', label: '购买次数' },
] as const;

export const DEFAULT_DISCLAIMER =
  '本分析内容基于公开数据和统计模型生成，仅供娱乐与学习参考。\n- 不构成任何投注、投资或实际决策建议\n- 不保证预测结果的准确性\n- 用户应自行承担使用本服务的一切风险\n\n本服务不鼓励任何形式的赌博行为。';

export const API_ERROR_MESSAGES = {
  network: '网络连接失败，请稍后再试。',
  unauthorized: '请先登录后再继续。',
  insufficientCredits: '剩余次数不足，请先购买。',
  unknown: '系统繁忙，请稍后再试。',
} as const;
