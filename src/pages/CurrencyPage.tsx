import React, { useEffect, useMemo, useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import strings from '../../res/strings';
import { getTableFields, TableField } from '../utils/schema';

interface Props {
  rows: Record<string, string>[];
  setRows: (rows: Record<string, string>[]) => void;
  next: () => void;
  back: () => void;
  logDebug?: (msg: string) => void;
}

export default function CurrencyPage({ rows, setRows, next, back, logDebug }: Props) {
  const [fields, setFields] = useState<TableField[]>([]);
  const [rowData, setRowData] = useState<Record<string, string>[]>(rows);
  const gridRef = useRef<AgGridReact<Record<string, string>>>(null);

  useEffect(() => {
    getTableFields('Currency').then(setFields);
  }, []);

  useEffect(() => {
    if (logDebug) logDebug(`CurrencyPage: loading grid with ${rows.length} rows`);
    // Only log when the row data changes to avoid infinite re-renders
    // triggered by a new logDebug function on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  useEffect(() => {
    setRowData(rows);
  }, [rows]);

  const columnDefs = useMemo(() => {
    if (fields.length)
      return fields.map(f => ({
        headerName: f.name,
        field: f.xmlName,
        sortable: true,
        filter: true,
        editable: true,
      }));
    if (rowData.length)
      return Object.keys(rowData[0]).map(key => ({
        headerName: key,
        field: key,
        sortable: true,
        filter: true,
        editable: true,
      }));
    return [];
  }, [fields, rowData]);

  useEffect(() => {
    const api = gridRef.current?.api;
    if (api) {
      api.sizeColumnsToFit();
    }
  }, [columnDefs]);

  function addRow() {
    const keys = fields.length
      ? fields.map(f => f.xmlName)
      : Object.keys(rowData[0] || {});
    const obj: Record<string, string> = {};
    keys.forEach(k => (obj[k] = ''));
    const updated = [...rowData, obj];
    setRowData(updated);
    setRows(updated);
  }

  function deleteSelected() {
    const api = gridRef.current?.api;
    if (!api) return;
    const selected = api.getSelectedRows();
    if (!selected.length) return;
    const updated = rowData.filter(r => !selected.includes(r));
    setRowData(updated);
    setRows(updated);
  }

  function onCellValueChanged(params: any) {
    const updated = [...rowData];
    updated[params.rowIndex] = {
      ...updated[params.rowIndex],
      [params.column.getColId()]: params.newValue,
    };
    setRowData(updated);
    setRows(updated);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name.toLowerCase();
    try {
      if (name.endsWith('.csv')) {
        const text = await file.text();
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        if (!lines.length) return;
        const headers = lines[0].split(',');
        const rowsParsed: Record<string, string>[] = lines.slice(1).map(line => {
          const parts = line.split(',');
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => {
            obj[h.trim()] = (parts[i] || '').trim();
          });
          return obj;
        });
        setRowData(rowsParsed);
        setRows(rowsParsed);
      } else if (name.endsWith('.xlsx')) {
        const XLSX = (window as any).XLSX;
        if (!XLSX) return;
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet);
        const rowsParsed: Record<string, string>[] = json.map(r => {
          const obj: Record<string, string> = {};
          Object.keys(r).forEach(k => (obj[k] = r[k] != null ? String(r[k]) : ''));
          return obj;
        });
        setRowData(rowsParsed);
        setRows(rowsParsed);
      }
    } catch (err) {
      console.error('Failed to parse file', err);
    } finally {
      e.target.value = '';
    }
  }

  function downloadTemplate() {
    const XLSX = (window as any).XLSX;
    if (!XLSX) return;
    const headers =
      fields.length > 0
        ? fields.map(f => f.xmlName)
        : ['Code', 'ISOCode', 'CurrencySymbol', 'Decimals', 'RoundingPrecision'];
    const rowsForSheet = rowData.length ? rowData : [Object.fromEntries(headers.map(h => [h, '']))];
    const ws = XLSX.utils.json_to_sheet(rowsForSheet, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Currency');
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([buf], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'currency_template.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="section-header">{strings.currencies}</div>
      <p>You can add, edit, or delete currencies directly below:</p>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          onCellValueChanged={onCellValueChanged}
          defaultColDef={{ flex: 1, resizable: true, editable: true }}
        />
      </div>
      <div className="nav" style={{ marginTop: 10 }}>
        <button type="button" onClick={addRow}>Add Row</button>
        <button type="button" onClick={deleteSelected} style={{ marginLeft: 10 }}>Delete Selected</button>
      </div>
      <p style={{ marginTop: 20 }}>
        Alternatively, you can upload a file with a list of currencies.{' '}
        <a href="#" onClick={e => { e.preventDefault(); downloadTemplate(); }}>
          Download template
        </a>
      </p>
      <input type="file" accept=".xlsx,.csv" onChange={handleFileUpload} />
      <div className="nav">
        <button className="back-btn" onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={next}>{strings.next}</button>
        <button className="skip-btn" onClick={next}>{strings.skip}</button>
      </div>
    </div>
  );
}
