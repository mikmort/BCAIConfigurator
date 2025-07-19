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
import { ExcelIcon, InfoIcon } from '../components/Icons';

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

export default function NumberSeriesPage({
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
  const [aiTip, setAiTip] = useState('');
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
    getTableFields('No. Series', true).then(setFields);
  }, []);

  useEffect(() => {
    async function fetchTip() {
      if (!formData.industry) return;
      try {
        const prompt =
          'You are assisting with configuring Dynamics 365 Business Central. ' +
          `The company industry is "${formData.industry}". ` +
          'Here is the known company setup data as JSON:\n' +
          JSON.stringify(formData, null, 2) +
          '\nProvide instructions on how to choose number series that make sense for this industry. ' +
          'The response can be up to 600 characters.';
        const ans = await askOpenAI(prompt, logDebug);
        setAiTip(ans.trim());
      } catch (e) {
        console.error(e);
      }
    }
    fetchTip();
    // We only want to refetch if the industry changes
  }, [formData.industry]);

  useEffect(() => {
    if (logDebug)
      logDebug(`NumberSeriesPage: loading grid with ${rows.length} rows`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  useEffect(() => {
    setRowData(filterRows(fields, rows));
  }, [rows, fields]);

  const columnDefs = useMemo(
    () => createColumnDefs(rowData, fields),
    [rowData, fields],
  );

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
        '\nCurrent number series rows:\n' +
        JSON.stringify(currentRows ?? rowData, null, 2) +
        optionsInfo +
        '\nSuggest the best rows for the number series table. ' +
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
    const blob = createTemplateBlob('No. Series', rowData, fields);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'number_series_template.xlsx';
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
      <div className="section-header">{strings.numberSeries}</div>
      {confirmed && <div className="confirmed-banner">{strings.confirmedBanner}</div>}
      <p>{strings.numberSeriesIntro}</p>
      <div className="grid-toolbar">
        <button type="button" className="grid-action-btn" onClick={addRow}>
          {strings.addRow}
        </button>
        <button
          type="button"
          className="grid-action-btn"
          onClick={deleteSelected}
        >
          {strings.deleteSelected}
        </button>
        <button
          type="button"
          className="ai-btn"
          onClick={() => askAIForGrid()}
        >
          <span className="icon">✨</span> {strings.askAiToHelp}
        </button>
      </div>
      <div
        className="ag-theme-alpine number-series-grid"
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
      {aiTip && (
        <div className="ai-tip">
          <InfoIcon className="info-icon" />
          <div>
            <strong>AI Tip: </strong>
            {aiTip}
          </div>
        </div>
      )}
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
          {strings.uploadCsv}
        </button>
        <button
          type="button"
          className="download-template-link"
          onClick={downloadTemplate}
        >
          <ExcelIcon className="excel-icon" /> {strings.downloadTemplate}
        </button>
      </div>
      <div className="divider" />
      <div className="nav">
        <button className="skip-btn" onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={handleConfirm}>
          {confirmed ? strings.markNotConfirmed : strings.confirm}
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
