export function fieldKey(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '_');
}

export function mapFieldName(name: string): string {
  return name.replace(/\s+/g, '').replace(/\./g, '').replace(/-/g, '_');
}

export function findFieldValue(obj: any, field: string): any {
  if (!obj || typeof obj !== 'object') return undefined;
  if (Object.prototype.hasOwnProperty.call(obj, field)) {
    const val = obj[field];
    if (Array.isArray(val)) {
      for (const v of val) {
        const found = findFieldValue(v, '#text');
        if (found !== undefined) return found;
      }
    } else if (typeof val === 'object') {
      if ('#text' in val) return val['#text'];
      const found = findFieldValue(val, '#text');
      if (found !== undefined) return found;
    } else {
      return val;
    }
  }
  for (const key of Object.keys(obj)) {
    const child = obj[key];
    if (typeof child === 'object') {
      const found = findFieldValue(child, field);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

export function findTableRows(obj: any, tableId: number): any[] | null {
  if (!obj || typeof obj !== 'object') return null;
  const idObj = (obj as any)['TableID'];
  let idVal: any = undefined;
  if (idObj !== undefined) {
    if (typeof idObj === 'object' && '#text' in idObj) idVal = idObj['#text'];
    else idVal = idObj;
  }
  if (idVal !== undefined && Number(idVal) === tableId) {
    for (const key of Object.keys(obj)) {
      if (key === 'TableID' || key === 'PageID' || key === '#text' || key.startsWith('@')) continue;
      const rows: any = (obj as any)[key];
      if (Array.isArray(rows)) return rows;
      if (rows && typeof rows === 'object') return [rows];
    }
  }
  for (const key of Object.keys(obj)) {
    const child = (obj as any)[key];
    if (Array.isArray(child)) {
      for (const c of child) {
        const found = findTableRows(c, tableId);
        if (found) return found;
      }
    } else if (typeof child === 'object') {
      const found = findTableRows(child, tableId);
      if (found) return found;
    }
  }
  return null;
}

export function extractFieldValues(rows: any[], field: string): string[] {
  const vals: string[] = [];
  rows.forEach(r => {
    let v: any = r ? r[field] : undefined;
    if (v !== undefined && v !== null) {
      if (typeof v === 'object' && '#text' in v) v = v['#text'];
      if (v !== undefined && v !== null) {
        const s = String(v);
        if (s && !vals.includes(s)) vals.push(s);
      }
    }
  });
  return vals;
}

export function defaultCurrencyText(code: string): string {
  return `(Default LCY) ${code}`;
}
