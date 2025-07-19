let cache: any[] | null = null;

export async function getEnumValues(enumName: string): Promise<string[]> {
  if (!cache) {
    const resp = await fetch('/businesscentral_enums_en-us_populated.json');
    cache = await resp.json();
  }
  if (!Array.isArray(cache)) return [];
  const found = cache.find((e: any) => e.Name === enumName);
  if (!found || !Array.isArray(found.Values)) return [];
  return found.Values.map((v: any) => v.Caption || v.Name || String(v.Ordinal));
}
