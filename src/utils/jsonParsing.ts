import { CompanyField } from '../types';

export interface ConfigQuestion {
  Field: string;
  RecommendedSetting?: string;
  Considerations?: string;
}

export function recommendedCode(text: string): string {
  const match = text.match(/[A-Z0-9]{2,}/);
  return match ? match[0] : text;
}

export function parseQuestions(
  questions: ConfigQuestion[],
  names: string[]
): CompanyField[] {
  const map = new Map<string, ConfigQuestion>();
  questions.forEach(q => {
    if (q.Field) map.set(q.Field, q);
  });
  return names.map(name => ({
    field: name,
    recommended: map.get(name)?.RecommendedSetting || '',
    considerations: map.get(name)?.Considerations || '',
  }));
}
