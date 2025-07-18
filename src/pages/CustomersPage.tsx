import React, { useEffect, useMemo, useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import strings from "../../res/strings";
import { getTableFields, TableField } from "../utils/schema";
import {
  filterRows,
  createColumnDefs,
  createBottomRowData,
  createEmptyRow,
  parseFileUpload,
  createTemplateBlob,
} from "../utils/grid";
import { askOpenAI, parseAIGrid } from "../utils/ai";
import AISuggestionModal from "../components/AISuggestionModal";
import { ExcelIcon } from "../components/Icons";
import { fieldKey, defaultCurrencyText } from "../utils/helpers";

interface Props {
  rows: Record<string, string>[];
  setRows: (rows: Record<string, string>[]) => void;
  next: () => void;
  back: () => void;
  logDebug?: (msg: string) => void;
  formData: { [key: string]: any };
  confirmed: boolean;
  setConfirmed: (val: boolean) => void;
  countries: { code: string; name: string }[];
  setCountries: (arr: { code: string; name: string }[]) => void;
  currencies: { code: string; description: string }[];
  setCurrencies: (arr: { code: string; description: string }[]) => void;
  postingGroups: string[];
  setPostingGroups: (arr: string[]) => void;
}

export default function CustomersPage({
  rows,
  setRows,
  next,
  back,
  logDebug,
  formData,
  confirmed,
  setConfirmed,
  countries,
  setCountries,
  currencies,
  setCurrencies,
  postingGroups,
  setPostingGroups,
}: Props) {
  const [fields, setFields] = useState<TableField[]>([]);
  const [rowData, setRowData] = useState<Record<string, string>[]>([]);
  const [showAI, setShowAI] = useState(false);
  const [aiRows, setAiRows] = useState<Record<string, string>[]>([]);
  const [aiExplanation, setAiExplanation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const gridRef = useRef<AgGridReact<Record<string, string>>>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  function openFileDialog() {
    fileInputRef.current?.click();
  }

  useEffect(() => {
    getTableFields("Customer", true).then(setFields);
  }, []);

  useEffect(() => {
    if (logDebug)
      logDebug(`CustomersPage: loading grid with ${rows.length} rows`);
    // Only log when the row data changes to avoid infinite re-renders
    // triggered by a new logDebug function on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  useEffect(() => {
    setRowData(filterRows(fields, rows));
  }, [rows, fields]);

  const currencyField = useMemo(
    () => fields.find((f) => f.name === "Currency Code")?.xmlName,
    [fields],
  );
  const countryField = useMemo(
    () => fields.find((f) => f.name === "Country/Region Code")?.xmlName,
    [fields],
  );
  const postingField = useMemo(
    () => fields.find((f) => f.name === "Customer Posting Group")?.xmlName,
    [fields],
  );

  const localCurrency = useMemo(
    () => formData[fieldKey("Local Currency (LCY) Code")] || "",
    [formData],
  );
  const defaultCurrency = useMemo(
    () => defaultCurrencyText(localCurrency.trim()),
    [localCurrency],
  );

  const currencyOptions = useMemo(() => {
    const norm = localCurrency.trim().toLowerCase();
    return Array.from(
      new Set(
        currencies
          .map(c => c.code.trim())
          .filter(c => c && c.toLowerCase() !== norm),
      ),
    );
  }, [currencies, localCurrency]);

  const dropdowns = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (currencyField) {
      map[currencyField] = currencyOptions;
    }
    if (countryField) map[countryField] = countries.map(c => c.code);
    if (postingField) map[postingField] = postingGroups;
    return map;
  }, [
    currencyField,
    countryField,
    postingField,
    currencyOptions,
    countries,
    postingGroups,
  ]);

  const columnDefs = useMemo(() => {
    const defs = createColumnDefs(rowData, fields, dropdowns);
    if (currencyField) {
      const col = defs.find(d => d.field === currencyField);
      if (col) {
        col.valueFormatter = (p: any) =>
          p.node?.rowPinned === 'bottom' ? '' : p.value || defaultCurrency;
        col.valueParser = (p: any) =>
          p.newValue === defaultCurrency ? '' : p.newValue;
        col.cellEditorParams = { values: [defaultCurrency, ...currencyOptions] };
      }
    }
    return defs;
  }, [rowData, fields, dropdowns, currencyField, defaultCurrency, currencyOptions]);

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
    const updated = rowData.filter((r) => !selected.includes(r));
    setRowData(updated);
    setRows(updated);
  }

  async function askAIForGrid(
    extra: string = "",
    currentRows?: Record<string, string>[],
  ) {
    try {
      setShowAI(true);
      setAiLoading(true);
      let optionsInfo = "";
      const lines = Object.entries(dropdowns).map(([field, vals]) => {
        const name = fields.find(f => f.xmlName === field)?.name || field;
        return `${name}: ${vals.join(", ")}`;
      });
      if (lines.length) {
        optionsInfo = "\nField options:\n" + lines.join("\n");
      }

      const prompt =
        "Given the following company setup data as JSON:\n" +
        JSON.stringify(formData, null, 2) +
        "\nCurrent customer rows:\n" +
        JSON.stringify(currentRows ?? rowData, null, 2) +
        optionsInfo +
        "\nSuggest the best rows for the customer table. " +
        'Return JSON with a "rows" array and an "explanation" string no longer than 500 characters.' +
        (extra ? `\nAdditional Instructions:\n${extra}` : "");
      const ans = await askOpenAI(prompt, logDebug);
      const parsed = parseAIGrid(ans);
      setAiRows(filterRows(fields, parsed.rows));
      setAiExplanation(parsed.explanation);
    } catch (e) {
      console.error(e);
      setAiRows([]);
      setAiExplanation("Failed to get AI suggestion");
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

    const field = params.column.getColId();
    const val = params.newValue;
    if (field === currencyField) {
      if (val && !currencies.find((c) => c.code === val)) {
        setCurrencies([...currencies, { code: val, description: val }]);
      }
    } else if (field === countryField) {
      if (val && !countries.find((c) => c.code === val)) {
        setCountries([...countries, { code: val, name: val }]);
      }
    } else if (field === postingField) {
      if (val && !postingGroups.includes(val)) {
        setPostingGroups([...postingGroups, val]);
      }
    }
  }

  function onCellClicked(params: any) {
    if (params.node.rowPinned === "bottom") {
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
      console.error("Failed to parse file", err);
    } finally {
      e.target.value = "";
    }
  }

  function downloadTemplate() {
    const blob = createTemplateBlob("Customer", rowData, fields);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer_template.xlsx";
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
      <div className="section-header">{strings.customers}</div>
      {confirmed && <div className="confirmed-banner">{strings.confirmedBanner}</div>}
      <p>{strings.customersIntro}</p>
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
        <button type="button" className="ai-btn" onClick={() => askAIForGrid()}>
          <span className="icon">✨</span> {strings.askAiToHelp}
        </button>
      </div>
      <div
        className="ag-theme-alpine customer-grid"
        style={{ height: 400, width: "100%" }}
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
          onCellFocused={(e) => {
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
          style={{ display: "none" }}
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
        <button className="skip-btn" onClick={back}>
          {strings.back}
        </button>
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
