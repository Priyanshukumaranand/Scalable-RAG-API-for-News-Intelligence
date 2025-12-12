import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';

const genAI = env.geminiApiKey ? new GoogleGenerativeAI(env.geminiApiKey) : null;

export async function generateAnswer(prompt: string): Promise<string> {
  if (!genAI) {
    // Offline fallback for dev/testing without API key.
    return `FAKE_GEMINI_RESPONSE: ${prompt.slice(0, 80)}...`;
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const text = result.response?.text();
  if (!text) throw new Error('Empty LLM response');
  return text;
}
