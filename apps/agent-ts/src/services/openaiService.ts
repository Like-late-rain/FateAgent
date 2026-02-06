import OpenAI from 'openai';

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const baseURL = process.env.OPENAI_API_BASE;

    client = new OpenAI({
      apiKey,
      ...(baseURL ? { baseURL } : {})
    });
  }
  return client;
}

export async function chatCompletion(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const openai = getOpenAIClient();
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.3,
    max_tokens: 2000
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from OpenAI');
  }

  return content;
}

export function parseJsonResponse<T>(content: string): T {
  // 清理可能的 markdown 格式
  let cleaned = content.trim();
  if (cleaned.includes('```json')) {
    cleaned = cleaned.split('```json')[1].split('```')[0];
  } else if (cleaned.includes('```')) {
    cleaned = cleaned.split('```')[1].split('```')[0];
  }

  return JSON.parse(cleaned.trim()) as T;
}
