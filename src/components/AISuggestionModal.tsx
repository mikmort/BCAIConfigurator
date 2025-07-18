import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';

interface Props {
  show: boolean;
  rows: Record<string, string>[];
  columnDefs: any[];
  explanation: string;
  loading: boolean;
  onAccept: () => void;
  onClose: () => void;
  onSuggestAgain: (extra: string) => void;
}

export default function AISuggestionModal({
  show,
  rows,
  columnDefs,
  explanation,
  loading,
  onAccept,
  onClose,
  onSuggestAgain,
}: Props) {
  const [extra, setExtra] = useState('');
  const gridRef = useRef<AgGridReact<Record<string, string>> | null>(null);

  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    if (loading) {
      api.showLoadingOverlay();
    } else {
      api.hideOverlay();
    }
  }, [loading]);

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            defaultColDef={{ flex: 1, resizable: true }}
            overlayNoRowsTemplate="No rows"
            overlayLoadingTemplate="Loading..."
          />
        </div>
        <p style={{ whiteSpace: 'pre-wrap', marginTop: 10 }}>{explanation}</p>
        <label htmlFor="ai-extra" className="ai-extra-label">
          Additional Instructions
        </label>
        <textarea
          id="ai-extra"
          value={extra}
          onChange={e => setExtra(e.target.value)}
          rows={6}
        />
        <button className="go-btn" onClick={() => onSuggestAgain(extra)}>
          Suggest again
        </button>
        <div className="nav modal-actions">
          <button className="next-btn" onClick={onAccept} disabled={loading}>
            Accept
          </button>
          <button className="next-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
