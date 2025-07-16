import { CompanyField } from '../types';

export function recommendedCode(text: string): string {
  const match = text.match(/[A-Z0-9]{2,}/);
  return match ? match[0] : text;
}

export function parseCompanyInfo(text: string): CompanyField[] {
  const lines = text.split('\n').map(l => l.trim());
  const names = [
    'Company Name',
    'Address',
    'Phone No. /',
    'Country/Region',
    'Tax',
    'Fed. Tax ID (if',
    'Company',
    'Base Calendar',
    'Invoice Address',
    'Logo (Picture)',
    'Bank Accounts',
  ];
  const displayNames = [
    'Company Name',
    'Address',
    'Phone No./Email',
    'Country/Region Code',
    'Tax Registration No.',
    'Fed. Tax ID (if available)',
    'Company Website',
    'Base Calendar Code',
    'Invoice Address Code',
    'Logo (Picture)',
    'Bank Accounts',
  ];
  const indexes = names.map(n => lines.indexOf(n));
  indexes.push(lines.length);
  const result: CompanyField[] = [];
  for (let i = 0; i < names.length; i++) {
    const slice = lines.slice(indexes[i] + 1, indexes[i + 1]).filter(l => l);
    while (
      slice[0] &&
      (/Blank/i.test(slice[0]) ||
        /None/i.test(slice[0]) ||
        /^\(/.test(slice[0]) ||
        /City/.test(slice[0]) ||
        /ZIP/.test(slice[0]) ||
        /Code$/.test(slice[0]) ||
        /available\)/.test(slice[0]) ||
        /fields/i.test(slice[0]))
    ) {
      slice.shift();
    }
    const idxCons = slice.findIndex(
      l =>
        l.startsWith('The ') ||
        l.startsWith('If ') ||
        l.startsWith('Bank ') ||
        l.startsWith('Note:')
    );
    const rec = idxCons >= 0 ? slice.slice(0, idxCons) : slice;
    const cons = idxCons >= 0 ? slice.slice(idxCons) : [];
    result.push({
      field: displayNames[i],
      recommended: rec.join(' ').trim(),
      considerations: cons.join(' ').trim(),
    });
  }
  return result;
}

export function parseGuideTable(text: string, fields: string[]): CompanyField[] {
  const join = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  const result: CompanyField[] = [];
  for (let i = 0; i < fields.length; i++) {
    const name = fields[i];
    const regex = new RegExp(esc(name), 'i');
    const match = regex.exec(join);
    if (!match) {
      result.push({ field: name, recommended: '', considerations: '' });
      continue;
    }
    const start = match.index + match[0].length;
    let end = join.length;
    if (i + 1 < fields.length) {
      const nextRegex = new RegExp(esc(fields[i + 1]), 'i');
      const next = nextRegex.exec(join.slice(start));
      if (next) end = start + next.index;
    }
    const snippet = join.slice(start, end).trim();
    result.push({ field: name, recommended: '', considerations: snippet });
  }
  return result;
}
