import React, { useEffect, useMemo, useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import strings from '../../res/strings';
import { getTableFields, TableField } from '../utils/schema';
import {
  filterRows,
  createColumnDefs,
  createBottomRowData,
  createEmptyRow,
  parseFileUpload,
  createTemplateBlob,
} from '../utils/grid';
import { getEnumValues } from '../utils/enums';
import { askOpenAI, parseAIGrid } from '../utils/ai';
import AISuggestionModal from '../components/AISuggestionModal';
import { ExcelIcon } from '../components/Icons';

interface Props {
  rows: Record<string, string>[];
  setRows: (rows: Record<string, string>[]) => void;
  next: () => void;
  back: () => void;
  logDebug?: (msg: string) => void;
  formData: { [key: string]: any };
  confirmed: boolean;
  setConfirmed: (val: boolean) => void;
}

export default function ChartOfAccountsPage({
  rows,
  setRows,
  next,
  back,
  logDebug,
  formData,
  confirmed,
  setConfirmed,
}: Props) {
  const [fields, setFields] = useState<TableField[]>([]);
  const [rowData, setRowData] = useState<Record<string, string>[]>([]);
  const [accountTypeField, setAccountTypeField] = useState<string>('');
  const [accountTypeOptions, setAccountTypeOptions] = useState<string[]>([]);
  const [showAI, setShowAI] = useState(false);
  const [aiRows, setAiRows] = useState<Record<string, string>[]>([]);
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const gridRef = useRef<AgGridReact<Record<string, string>>>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  function openFileDialog() {
    fileInputRef.current?.click();
  }

  useEffect(() => {
    getTableFields('G/L Account', true).then(setFields);
  }, []);

  useEffect(() => {
    const fld = fields.find(f => f.name === 'Account Type');
    if (fld) setAccountTypeField(fld.xmlName);
  }, [fields]);

  useEffect(() => {
    getEnumValues('G/L Account Type').then(setAccountTypeOptions);
  }, []);

  useEffect(() => {
    if (logDebug)
      logDebug(`ChartOfAccountsPage: loading grid with ${rows.length} rows`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  useEffect(() => {
    setRowData(filterRows(fields, rows));
  }, [rows, fields]);

  const dropdowns = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (accountTypeField && accountTypeOptions.length) {
      map[accountTypeField] = accountTypeOptions;
    }
    return map;
  }, [accountTypeField, accountTypeOptions]);

  const columnDefs = useMemo(() => {
    const defs = createColumnDefs(rowData, fields, dropdowns);
    if (accountTypeField && accountTypeOptions.length) {
      const col = defs.find(d => d.field === accountTypeField);
      if (col) {
        col.valueFormatter = (p: any) => {
          if (p.node?.rowPinned === 'bottom') return '';
          const val = p.value;
          const idx = parseInt(val, 10);
          if (!isNaN(idx) && accountTypeOptions[idx]) return accountTypeOptions[idx];
          return val;
        };
        col.valueParser = (p: any) => {
          const idx = accountTypeOptions.indexOf(p.newValue);
          return idx === -1 ? p.newValue : String(idx);
        };
      }
    }
    return defs;
  }, [rowData, fields, dropdowns, accountTypeField, accountTypeOptions]);

  const bottomRowData = useMemo(
    () => createBottomRowData(columnDefs),
    [columnDefs],
  );

  function addRow() {
    const obj = createEmptyRow(fields, rowData);
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

  async function askAIForGrid(
    extra: string = '',
    currentRows?: Record<string, string>[]
  ) {
    try {
      setShowAI(true);
      setAiLoading(true);
      let optionsInfo = '';
      const lines: string[] = [];
      if (lines.length) {
        optionsInfo = '\nField options:\n' + lines.join('\n');
      }

      const prompt =
        'Given the following company setup data as JSON:\n' +
        JSON.stringify(formData, null, 2) +
        '\nCurrent chart of accounts rows:\n' +
        JSON.stringify(currentRows ?? rowData, null, 2) +
        optionsInfo +
        '\nSuggest the best rows for the chart of accounts table. ' +
        'Return JSON with a "rows" array and an "explanation" string no longer than 500 characters.' +
        (extra ? `\nAdditional Instructions:\n${extra}` : '');
      const ans = await askOpenAI(prompt, logDebug);
      const parsed = parseAIGrid(ans);
      setAiRows(filterRows(fields, parsed.rows));
      setAiExplanation(parsed.explanation);
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

  function suggestAgain(extra: string) {
    askAIForGrid(extra, aiRows);
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

  function onCellClicked(params: any) {
    if (params.node.rowPinned === 'bottom') {
      addRow();
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rowsParsed = await parseFileUpload(file, fields);
      if (rowsParsed.length) {
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
    const blob = createTemplateBlob('G/L Account', rowData, fields);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart_of_accounts_template.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleConfirm() {
    if (confirmed) {
      setConfirmed(false);
    } else {
      next();
    }
  }

  return (
    <div>
      <div className="section-header">{strings.chartOfAccounts}</div>
      {confirmed && <div className="confirmed-banner">Confirmed!</div>}
      <p>You can add, edit, or delete accounts directly below:</p>
      <div className="grid-toolbar">
        <button type="button" className="grid-action-btn" onClick={addRow}>
          Add Row
        </button>
        <button
          type="button"
          className="grid-action-btn"
          onClick={deleteSelected}
        >
          Delete Selected
        </button>
        <button
          type="button"
          className="ai-btn"
          onClick={() => askAIForGrid()}
        >
          <span className="icon">✨</span> Ask AI to Help
        </button>
      </div>
      <div
        className="ag-theme-alpine gl-grid"
        style={{ height: 400, width: '100%' }}
        tabIndex={0}
        onFocus={e => {
          if (e.target !== e.currentTarget) return;
          if (!gridRef.current || !columnDefs.length) return;
          if (!gridRef.current.api.getFocusedCell()) {
            gridRef.current.api.setFocusedCell(0, columnDefs[0].field);
          }
        }}
      >
        <AgGridReact
          theme="legacy"
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          pinnedBottomRowData={bottomRowData}
          onCellClicked={onCellClicked}
          rowSelection="multiple"
          rowHeight={36}
          singleClickEdit={true}
          onCellFocused={e => {
            if (e.rowIndex == null || !e.column) return;
            gridRef.current?.api.startEditingCell({
              rowIndex: e.rowIndex,
              colKey: e.column.getColId(),
            });
          }}
          onCellValueChanged={onCellValueChanged}
          defaultColDef={{ flex: 1, resizable: true, editable: true }}
        />
      </div>
      <div className="file-controls">
        <input
          type="file"
          accept=".xlsx,.csv"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="download-template-btn"
          onClick={openFileDialog}
        >
          Upload CSV/XSLX
        </button>
        <button
          type="button"
          className="download-template-link"
          onClick={downloadTemplate}
        >
          <ExcelIcon className="excel-icon" /> Download Template
        </button>
      </div>
      <div className="divider" />
      <div className="nav">
        <button className="skip-btn" onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={handleConfirm}>
          {confirmed ? 'Mark as Not Confirmed' : 'Confirm'}
        </button>
        {!confirmed && (
          <button className="skip-btn skip-right" onClick={next}>
            {strings.skip}
          </button>
        )}
      </div>
      <AISuggestionModal
        show={showAI}
        rows={aiRows}
        columnDefs={columnDefs}
        explanation={aiExplanation}
        loading={aiLoading}
        onAccept={acceptAI}
        onClose={() => setShowAI(false)}
        onSuggestAgain={suggestAgain}
      />
    </div>
  );
}
