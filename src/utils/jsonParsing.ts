import { CompanyField } from '../types';

export interface ConfigQuestion {
  Field: string;
  RecommendedSetting?: string;
  Considerations?: string;
  common?: string;
  FieldType?: string;
  Question?: string;
  'BC Field Name'?: string;
  'Lookup Table'?: number;
  'Lookup Field'?: string;
  tableId?: number;
  tableName?: string;
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
  return names.map(name => {
    const q = map.get(name);
    let common: 'common' | 'sometimes' | 'unlikely' = 'unlikely';
    const val = q?.common?.toLowerCase() || '';
    if (val.includes('common')) common = 'common';
    else if (val.includes('sometimes')) common = 'sometimes';
    else if (val.includes('unlikely')) common = 'unlikely';
    return {
      field: name,
      recommended: q?.RecommendedSetting || '',
      considerations: q?.Considerations || '',
      common,
      fieldType: q?.FieldType,
      question: q?.Question,
      bcFieldName: (q as any)?.['BC Field Name']
        ? String((q as any)['BC Field Name'])
        : undefined,
      lookupTable: (q as any)?.['Lookup Table']
        ? Number((q as any)['Lookup Table'])
        : undefined,
      lookupField: (q as any)?.['Lookup Field']
        ? String((q as any)['Lookup Field'])
        : undefined,
      tableId: q?.tableId,
    };
  });
}
