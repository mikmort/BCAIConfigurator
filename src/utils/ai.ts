import { AISuggestion } from '../types';

/**
 * Send a prompt to Azure OpenAI and return the text response.
 */
export async function askOpenAI(prompt: string, log?: (m: string) => void): Promise<string> {
  try {
    log?.(`Asking OpenAI: ${prompt}`);
    const cfg = (window as any).azureOpenAIConfig || {};
    if (!cfg.endpoint || !cfg.apiKey || !cfg.deployment) {
      throw new Error('Azure OpenAI not configured');
    }
    const url = `${cfg.endpoint}/openai/deployments/${cfg.deployment}/chat/completions?api-version=2024-02-15-preview`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': cfg.apiKey,
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });
    const data = await resp.json();
    const answer = data.choices?.[0]?.message?.content || '';
    log?.('OpenAI answered');
    return answer;
  } catch (e) {
    log?.(`OpenAI call failed: ${e}`);
    throw e;
  }
}

/**
 * Extract the suggested value and reasoning from the OpenAI response.
 */
export function parseAISuggestion(text: string): AISuggestion {
  if (!text) return { suggested: '', confidence: '', reasoning: '' };
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    const suggested =
      parsed['Suggested Value'] ||
      parsed.suggested ||
      parsed.value ||
      parsed.result ||
      parsed.val ||
      (typeof parsed === 'object' ? parsed[Object.keys(parsed)[0]] : '');
    return {
      suggested: suggested || '',
      confidence: parsed['Confidence'] || parsed.confidence || '',
      reasoning: parsed['Reasoning'] || parsed.reasoning || '',
    };
  } catch {
    return { suggested: text, confidence: '', reasoning: '' };
  }
}
