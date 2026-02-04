import type { ProductType } from '@fateagent/shared-types';

export const COOKIE_NAME = 'fateagent_token';

export const PRODUCT_CONFIG: Record<
  ProductType,
  { credits: number; priceCents: number }
> = {
  credits_10: { credits: 10, priceCents: 1000 },
  credits_30: { credits: 30, priceCents: 2500 },
  credits_100: { credits: 100, priceCents: 7000 }
};

export const DISCLAIMER_TEXT = `免责声明：
本分析内容基于公开数据和统计模型生成，仅供娱乐与学习参考。
- 不构成任何投注、投资或实际决策建议
- 不保证预测结果的准确性
- 用户应自行承担使用本服务的一切风险

本服务不鼓励任何形式的赌博行为。`;
