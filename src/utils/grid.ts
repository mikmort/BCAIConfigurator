export interface ColumnDef {
  headerName: string;
  field: string;
  sortable?: boolean;
  filter?: boolean;
  editable?: boolean;
  cellEditor?: string;
  cellEditorParams?: any;
}

import type { TableField } from "./schema";

export function filterRows(
  fields: TableField[],
  data: Record<string, string>[],
): Record<string, string>[] {
  if (!fields.length) return data;
  const names = fields.map((f) => f.xmlName);
  return data.map((r) => {
    const obj: Record<string, string> = {};
    names.forEach((n) => {
      obj[n] = r[n] ?? "";
    });
    return obj;
  });
}

export function createColumnDefs(
  rowData: Record<string, string>[],
  fields: TableField[],
  dropdowns: Record<string, string[]> = {},
): ColumnDef[] {
  if (!fields.length) {
    if (!rowData.length) return [];
    return Object.keys(rowData[0]).map((key) => {
      const def: ColumnDef = {
        headerName: key,
        field: key,
        sortable: true,
        filter: true,
        editable: true,
      };
      if (dropdowns[key]) {
        def.cellEditor = "agSelectCellEditor";
        const values = dropdowns[key].includes('')
          ? dropdowns[key]
          : ['', ...dropdowns[key]];
        def.cellEditorParams = { values };
      }
      return def;
    });
  }
  return fields.map((f) => {
    const def: ColumnDef = {
      headerName: f.name,
      field: f.xmlName,
      sortable: true,
      filter: true,
      editable: true,
    };
    if (dropdowns[f.xmlName]) {
      def.cellEditor = "agSelectCellEditor";
      const values = dropdowns[f.xmlName].includes('')
        ? dropdowns[f.xmlName]
        : ['', ...dropdowns[f.xmlName]];
      def.cellEditorParams = { values };
    }
    return def;
  });
}

export function createBottomRowData(
  columnDefs: ColumnDef[],
): Record<string, string>[] {
  if (!columnDefs.length) return [] as Record<string, string>[];
  const firstField = columnDefs[0].field;
  const row: Record<string, string> = {};
  columnDefs.forEach((col) => {
    if (col.field) row[col.field] = "";
  });
  row[firstField] = "+";
  return [row];
}

export function createEmptyRow(
  fields: TableField[],
  rowData: Record<string, string>[],
): Record<string, string> {
  const keys = fields.length
    ? fields.map((f) => f.xmlName)
    : Object.keys(rowData[0] || {});
  const obj: Record<string, string> = {};
  keys.forEach((k) => (obj[k] = ""));
  return obj;
}

export async function parseFileUpload(
  file: File,
  fields: TableField[],
): Promise<Record<string, string>[]> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv")) {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (!lines.length) return [];
    const headers = lines[0].split(",");
    const rowsParsed: Record<string, string>[] = lines.slice(1).map((line) => {
      const parts = line.split(",");
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h.trim()] = (parts[i] || "").trim();
      });
      return obj;
    });
    return filterRows(fields, rowsParsed);
  }
  if (name.endsWith(".xlsx")) {
    const XLSX = (window as any).XLSX;
    if (!XLSX) return [];
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet);
    const rowsParsed: Record<string, string>[] = json.map((r) => {
      const obj: Record<string, string> = {};
      Object.keys(r).forEach(
        (k) => (obj[k] = r[k] != null ? String(r[k]) : ""),
      );
      return obj;
    });
    return filterRows(fields, rowsParsed);
  }
  return [];
}

export function createTemplateBlob(
  sheetName: string,
  rowData: Record<string, string>[],
  fields: TableField[],
): Blob | null {
  const XLSX = (window as any).XLSX;
  if (!XLSX) return null;
  const headers =
    fields.length > 0
      ? fields.map((f) => f.xmlName)
      : Object.keys(rowData[0] || {});
  const data = rowData.length
    ? rowData
    : [Object.fromEntries(headers.map((h) => [h, ""]))];
  const ws = XLSX.utils.json_to_sheet(data, { header: headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  return new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}
