import { xmlToJson } from './xmlParsing';

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

export async function loadConfigTables(): Promise<any> {
  const resp = await fetch('/config_table_questions_common.json');
  return await resp.json();
}

