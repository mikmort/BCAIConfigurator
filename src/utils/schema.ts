import { mapFieldName } from './helpers';

let cache: any = null;
let mappings: any = null;

async function loadSchema() {
  if (!cache) {
    const resp = await fetch('/BC_Master_Tables_and_Fields_Complete.json');
    cache = await resp.json();
  }
  return cache;
}

async function loadMappings() {
  if (!mappings) {
    try {
      const resp = await fetch('/field_name_mappings.json');
      mappings = await resp.json();
    } catch {
      mappings = {};
    }
  }
  return mappings;
}

export interface TableField {
  name: string;
  xmlName: string;
}

export async function getTableFields(tableName: string): Promise<TableField[]> {
  const [schema, map] = await Promise.all([loadSchema(), loadMappings()]);
  if (Array.isArray(schema)) {
    const table = schema.find((t: any) => t.Name === tableName);
    if (table && Array.isArray(table.Fields)) {
      return table.Fields.map((f: any) => {
        const name = String(f['BC Field Name'] || f.Field);
        const xmlName = map[name] || mapFieldName(name);
        return { name, xmlName };
      });
    }
  }
  return [];
}
