import { xmlToJson } from './xmlParsing';
import type { ConfigQuestion } from './jsonParsing';

export async function loadStartingData(): Promise<any> {
  const resp = await fetch('NAV27.0.US.ENU.STANDARD.xml');
  let text: string;
  try {
    const buf = await resp.arrayBuffer();
    text = new TextDecoder('utf-16').decode(buf);
  } catch {
    text = await resp.text();
  }
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, 'application/xml');
  return {
    [xmlDoc.documentElement.nodeName]: xmlToJson(xmlDoc.documentElement),
  } as any;
}

export async function loadConfigTables(): Promise<ConfigQuestion[]> {
  const resp = await fetch('/BC_Setup_All_Tables_and_Fields_grouped_ordered.json');
  const data = await resp.json();
  const fields: ConfigQuestion[] = [];
  if (Array.isArray(data)) {
    data.forEach(t => {
      if (Array.isArray(t.Fields)) {
        t.Fields.forEach((f: ConfigQuestion) =>
          fields.push({ ...f, tableId: t.Number, tableName: t.Name })
        );
      }
    });
  }
  return fields;
}

