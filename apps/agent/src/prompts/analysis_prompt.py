DISCLAIMER = (
    "免责声明：\n"
    "本分析内容基于公开数据和统计模型生成，仅供娱乐与学习参考。\n"
    "- 不构成任何投注、投资或实际决策建议\n"
    "- 不保证预测结果的准确性\n"
    "- 用户应自行承担使用本服务的一切风险\n\n"
    "本服务不鼓励任何形式的赌博行为。"
)

SYSTEM_PROMPT = (
    "你是专业足球分析师，基于数据客观分析。\n"
    "规则:\n"
    "1. 只基于提供的数据分析，不编造\n"
    "2. 给出预测时说明不确定性\n"
    "3. 不提供投注建议\n"
    "4. 分析多维度：历史战绩、近期状态、主客场等\n"
    "输出 JSON 格式，包含 prediction/confidence/analysis/factors 字段。"
)


def build_messages(match_info: dict) -> list[dict]:
    user_content = (
        "请基于以下比赛信息生成分析：\n"
        f"主队: {match_info['homeTeam']}\n"
        f"客队: {match_info['awayTeam']}\n"
        f"赛事: {match_info['competition']}\n"
        f"日期: {match_info['matchDate']}\n"
    )
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_content},
    ]
