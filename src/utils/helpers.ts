export function fieldKey(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '_');
}

export function mapFieldName(name: string): string {
  return name.replace(/\s+/g, '').replace(/-/g, '_');
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
