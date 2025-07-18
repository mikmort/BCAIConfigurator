import React, { useEffect, useMemo, useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import strings from '../../res/strings';
import { getTableFields, TableField } from '../utils/schema';
import { askOpenAI } from '../utils/ai';

interface Props {
  rows: Record<string, string>[];
  setRows: (rows: Record<string, string>[]) => void;
  next: () => void;
  back: () => void;
  logDebug?: (msg: string) => void;
  formData: { [key: string]: any };
}

export default function CurrencyPage({ rows, setRows, next, back, logDebug, formData }: Props) {
  const [fields, setFields] = useState<TableField[]>([]);
  const [rowData, setRowData] = useState<Record<string, string>[]>([]);
  const [showAI, setShowAI] = useState(false);
  const [aiRows, setAiRows] = useState<Record<string, string>[]>([]);
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const gridRef = useRef<AgGridReact<Record<string, string>>>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function filterRows(data: Record<string, string>[]): Record<string, string>[] {
    if (!fields.length) return data;
    const names = fields.map(f => f.xmlName);
    return data.map(r => {
      const obj: Record<string, string> = {};
      names.forEach(n => {
        obj[n] = r[n] ?? '';
      });
      return obj;
    });
  }

  function openFileDialog() {
    fileInputRef.current?.click();
  }

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
    setRowData(filterRows(rows));
  }, [rows, fields]);

  const columnDefs = useMemo(() => {
    if (!fields.length) {
      if (!rowData.length) return [];
      return Object.keys(rowData[0]).map(key => ({
        headerName: key,
        field: key,
        sortable: true,
        filter: true,
        editable: true,
      }));
    }

    return fields.map(f => ({
      headerName: f.name,
      field: f.xmlName,
      sortable: true,
      filter: true,
      editable: true,
    }));
  }, [rowData, fields]);

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

  async function askAIForGrid() {
    try {
      setShowAI(true);
      setAiLoading(true);
      const prompt =
        'Given the following company setup data as JSON:\n' +
        JSON.stringify(formData, null, 2) +
        '\nCurrent currency rows:\n' +
        JSON.stringify(rowData, null, 2) +
        '\nSuggest the best rows for the currency table. ' +
        'Return JSON with a "rows" array and an "explanation" string.';
      const ans = await askOpenAI(prompt, logDebug);
      const cleaned = ans.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setAiRows(filterRows(parsed.rows || []));
      setAiExplanation(parsed.explanation || '');
    } catch (e) {
      console.error(e);
      setAiRows([]);
      setAiExplanation('Failed to get AI suggestion');
    } finally {
      setAiLoading(false);
    }
  }

  function acceptAI() {
    setRowData(aiRows);
    setRows(aiRows);
    setShowAI(false);
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
        const filtered = filterRows(rowsParsed);
        setRowData(filtered);
        setRows(filtered);
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
        const filtered = filterRows(rowsParsed);
        setRowData(filtered);
        setRows(filtered);
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
        : Object.keys(rowData[0] || {
            Code: '',
            ISOCode: '',
            CurrencySymbol: '',
            Decimals: '',
            RoundingPrecision: '',
          });

    // Use the current grid data if available, otherwise provide a single blank row
    const data = rowData.length
      ? rowData
      : [Object.fromEntries(headers.map(h => [h, '']))];

    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
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
      <div className="grid-toolbar">
        <button type="button" onClick={addRow}>Add Row</button>
        <button type="button" onClick={deleteSelected}>Delete Selected</button>
        <button type="button" className="ai-btn" onClick={askAIForGrid}>
          <span className="icon">✨</span> Ask AI to Help
        </button>
      </div>
      <div className="ag-theme-alpine currency-grid" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          rowHeight={36}
          onCellValueChanged={onCellValueChanged}
          defaultColDef={{ flex: 1, resizable: true, editable: true }}
        />
      </div>
      <p style={{ marginTop: 20 }}>
        <input
          type="file"
          accept=".xlsx,.csv"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="next-btn"
          onClick={openFileDialog}
          style={{ marginRight: 10 }}
        >
          Upload CSV/XSLX
        </button>
        <button
          type="button"
          className="download-template-btn"
          onClick={downloadTemplate}
        >
          Download template
        </button>
      </p>
      <div className="divider" />
      <div className="nav">
        <button className="skip-btn" onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={next}>Confirm</button>
        <button className="skip-btn skip-right" onClick={next}>
          {strings.skip}
        </button>
      </div>
      {showAI && (
        <div className="modal-overlay" onClick={() => setShowAI(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
              <AgGridReact rowData={aiRows} columnDefs={columnDefs} defaultColDef={{ flex: 1, resizable: true }} />
            </div>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: 10 }}>
              {aiLoading ? 'Loading...' : aiExplanation}
            </p>
            <div className="nav modal-actions">
              <button className="next-btn" onClick={acceptAI} disabled={aiLoading}>Accept</button>
              <button className="next-btn" onClick={() => setShowAI(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
