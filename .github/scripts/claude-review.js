const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');

const client = new Anthropic();

async function main() {
  const changedFiles = (process.env.CHANGED_FILES || '').split(' ').filter(f => f);
  const prTitle = process.env.PR_TITLE || '';
  const prBody = process.env.PR_BODY || '';

  if (changedFiles.length === 0) {
    console.log('No relevant files changed');
    fs.writeFileSync('review-result.json', JSON.stringify({
      decision: 'approve',
      comment: '没有需要审核的代码文件变更。'
    }));
    return;
  }

  // 确定变更涉及哪些模块
  const modules = new Set();
  for (const file of changedFiles) {
    if (file.startsWith('apps/web/')) modules.add('frontend');
    if (file.startsWith('apps/backend/')) modules.add('backend');
    if (file.startsWith('apps/agent/')) modules.add('agent');
    if (file.startsWith('packages/')) modules.add('shared');
  }

  // 读取变更的文件内容
  let fileContents = '';
  for (const file of changedFiles.slice(0, 15)) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      fileContents += `\n\n### 文件: ${file}\n\`\`\`\n${content.slice(0, 4000)}\n\`\`\``;
    } catch (e) {
      console.log(`无法读取文件: ${file}`);
    }
  }

  // 读取任务规则
  let taskRules = '';
  try {
    if (fs.existsSync('CODEX_TASK.md')) {
      taskRules = fs.readFileSync('CODEX_TASK.md', 'utf-8');
    }
  } catch (e) {
    console.log('未找到任务规则文件');
  }

  // 读取共享类型（用于验证类型一致性）
  let sharedTypes = '';
  try {
    if (fs.existsSync('packages/shared-types/src/api.ts')) {
      sharedTypes = fs.readFileSync('packages/shared-types/src/api.ts', 'utf-8');
    }
  } catch (e) {
    console.log('未找到共享类型文件');
  }

  const prompt = `你是 FateAgent 项目的代码审核专家。请审核以下 Pull Request。

## PR 信息
- 标题: ${prTitle}
- 描述: ${prBody}
- 涉及模块: ${Array.from(modules).join(', ')}

## 项目规则
${taskRules ? taskRules.slice(0, 15000) : '请检查代码质量、安全性和最佳实践。'}

## 共享类型定义（用于验证前后端类型一致性）
\`\`\`typescript
${sharedTypes.slice(0, 3000)}
\`\`\`

## 代码变更
${fileContents}

## 审核要求

### 1. 红线检查（违反任一项必须 request_changes）
**全局红线**:
- 是否硬编码了密钥/凭证？
- 是否有 SQL 拼接？
- TypeScript 是否使用了 any？
- 函数是否超过 100 行？

**前端红线** (如涉及 apps/web):
- 是否在组件中写了业务逻辑？
- 是否硬编码了 API 地址？
- 异步 UI 是否处理了 loading/error 状态？

**后端红线** (如涉及 apps/backend):
- Controller 是否包含业务逻辑？
- 是否有未验证就扣减次数的逻辑？

**Agent 红线** (如涉及 apps/agent):
- 是否提供了投注建议？
- 是否省略了免责声明？
- 是否暴露了 System Prompt？

### 2. 类型一致性检查
- 前后端是否使用了 shared-types 中的类型？
- API 请求/响应是否与共享类型一致？

### 3. 代码质量
- 是否有适当的错误处理？
- 命名是否清晰？
- 是否有不必要的复杂度？

## 输出格式（JSON）
{
  "decision": "approve" | "request_changes" | "comment",
  "summary": "一句话总结",
  "redline_violations": [
    {
      "rule": "违反的红线规则",
      "file": "文件路径",
      "line": "行号（可选）",
      "description": "具体问题"
    }
  ],
  "issues": [
    {
      "severity": "critical" | "warning" | "suggestion",
      "file": "文件路径",
      "description": "问题描述",
      "suggestion": "修改建议"
    }
  ],
  "type_consistency": {
    "passed": true | false,
    "issues": ["类型不一致的问题"]
  },
  "comment": "给开发者的完整反馈（Markdown 格式）"
}

**重要**:
- 如果有任何 redline_violations，decision 必须是 "request_changes"
- critical 级别问题也必须 request_changes
- 其他情况可以 approve 或 comment`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  });

  const reviewText = response.content[0].text;

  let reviewResult;
  try {
    const jsonMatch = reviewText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      reviewResult = JSON.parse(jsonMatch[0]);
    } else {
      reviewResult = { decision: 'comment', comment: reviewText };
    }
  } catch (e) {
    reviewResult = { decision: 'comment', comment: reviewText };
  }

  fs.writeFileSync('review-result.json', JSON.stringify(reviewResult, null, 2));
  console.log('Review completed:', reviewResult.decision);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
