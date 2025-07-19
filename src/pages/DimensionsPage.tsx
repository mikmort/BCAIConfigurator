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
import { askOpenAI, parseAIGrid } from '../utils/ai';
import AISuggestionModal from '../components/AISuggestionModal';
import { ExcelIcon } from '../components/Icons';
import { fieldKey } from '../utils/helpers';

interface Props {
  rows: Record<string, string>[];
  setRows: (rows: Record<string, string>[]) => void;
  next: () => void;
  back: () => void;
  logDebug?: (msg: string) => void;
  formData: { [key: string]: any };
  confirmed: boolean;
  setConfirmed: (val: boolean) => void;
  setFieldValue: (key: string, value: string) => void;
}

export default function DimensionsPage({
  rows,
  setRows,
  next,
  back,
  logDebug,
  formData,
  confirmed,
  setConfirmed,
  setFieldValue,
}: Props) {
  const [fields, setFields] = useState<TableField[]>([]);
  const [rowData, setRowData] = useState<Record<string, string>[]>([]);
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
    getTableFields('Dimension', true).then(setFields);
  }, []);

  const codeField = useMemo(
    () => fields.find(f => f.name === 'Code')?.xmlName || 'Code',
    [fields],
  );

  useEffect(() => {
    const base = filterRows(fields, rows);
    const gd1 = formData[fieldKey('Global Dimension 1 Code')] || '';
    const gd2 = formData[fieldKey('Global Dimension 2 Code')] || '';
    const updated = base.map(r => ({
      ...r,
      __UseAsGlobal: [gd1, gd2].includes(r[codeField] || '') ? '1' : r.__UseAsGlobal || '0',
    }));
    setRowData(updated);
  }, [rows, fields, formData, codeField]);

  const extraField: TableField = {
    name: 'Use as Global Dimension',
    xmlName: '__UseAsGlobal',
    fieldType: 'Boolean',
  };

  const columnDefs = useMemo(
    () => createColumnDefs(rowData, [...fields, extraField]),
    [rowData, fields],
  );

  const bottomRowData = useMemo(() => createBottomRowData(columnDefs), [columnDefs]);

  function addRow() {
    const obj = { ...createEmptyRow(fields, rowData), __UseAsGlobal: '0' };
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

  async function askAIForGrid(extra: string = '', currentRows?: Record<string, string>[]) {
    try {
      setShowAI(true);
      setAiLoading(true);
      const prompt =
        'Given the following company setup data as JSON:\n' +
        JSON.stringify(formData, null, 2) +
        '\nCurrent dimension rows:\n' +
        JSON.stringify(currentRows ?? rowData, null, 2) +
        '\nSuggest the best rows for the dimension table. ' +
        'Return JSON with a "rows" array and an "explanation" string no longer than 500 characters.' +
        (extra ? `\nAdditional Instructions:\n${extra}` : '');
      const ans = await askOpenAI(prompt, logDebug);
      const parsed = parseAIGrid(ans);
      const filtered = filterRows(fields, parsed.rows).map(r => ({ ...r, __UseAsGlobal: '0' }));
      setAiRows(filtered);
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

  function updateGlobals(updated: Record<string, string>[]) {
    const selected = updated.filter(r => r.__UseAsGlobal === '1').map(r => r[codeField] || '');
    setFieldValue(fieldKey('Global Dimension 1 Code'), selected[0] || '');
    setFieldValue(fieldKey('Global Dimension 2 Code'), selected[1] || '');
  }

  function onCellValueChanged(params: any) {
    const updated = [...rowData];
    updated[params.rowIndex] = {
      ...updated[params.rowIndex],
      [params.column.getColId()]: params.newValue,
    };
    if (params.column.getColId() === '__UseAsGlobal' && params.newValue === '1') {
      const count = updated.filter(r => r.__UseAsGlobal === '1').length;
      if (count > 2) {
        alert('Only two global dimensions can be selected. Please unselect another one first.');
        updated[params.rowIndex].__UseAsGlobal = '0';
        setRowData(updated);
        setRows(updated);
        return;
      }
    }
    setRowData(updated);
    setRows(updated);
    updateGlobals(updated);
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
        const parsed = rowsParsed.map(r => ({ ...r, __UseAsGlobal: '0' }));
        setRowData(parsed);
        setRows(parsed);
      }
    } catch (err) {
      console.error('Failed to parse file', err);
    } finally {
      e.target.value = '';
    }
  }

  function downloadTemplate() {
    const blob = createTemplateBlob('Dimension', rowData, [...fields, extraField]);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dimension_template.xlsx';
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
      <div className="section-header">{strings.dimensions}</div>
      {confirmed && <div className="confirmed-banner">Confirmed!</div>}
      <p>You can add, edit, or delete dimensions directly below:</p>
      <div className="grid-toolbar">
        <button type="button" className="grid-action-btn" onClick={addRow}>
          Add Row
        </button>
        <button type="button" className="grid-action-btn" onClick={deleteSelected}>
          Delete Selected
        </button>
        <button type="button" className="ai-btn" onClick={() => askAIForGrid()}>
          <span className="icon">✨</span> Ask AI to Help
        </button>
      </div>
      <div
        className="ag-theme-alpine dimension-grid"
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
        <button type="button" className="download-template-btn" onClick={openFileDialog}>
          Upload CSV/XSLX
        </button>
        <button type="button" className="download-template-link" onClick={downloadTemplate}>
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
