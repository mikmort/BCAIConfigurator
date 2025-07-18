import React, { useEffect, useMemo, useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import strings from '../../res/strings';
import { getTableFields, TableField } from '../utils/schema';

interface Props {
  rows: Record<string, string>[];
  next: () => void;
  back: () => void;
}

export default function VendorsPage({ rows, next, back }: Props) {
  const [fields, setFields] = useState<TableField[]>([]);
  const gridRef = useRef<AgGridReact<Record<string, string>>>(null);

  useEffect(() => {
    getTableFields('Vendor').then(setFields);
  }, []);

  const columnDefs = useMemo(() => {
    if (!rows.length) return [];
    if (!fields.length)
      return Object.keys(rows[0]).map(key => ({ headerName: key, field: key, sortable: true, filter: true }));
    return fields
      .filter(f => Object.prototype.hasOwnProperty.call(rows[0], f.xmlName))
      .map(f => ({ headerName: f.name, field: f.xmlName, sortable: true, filter: true }));
  }, [rows, fields]);

  return (
    <div>
      <div className="section-header">{strings.vendors}</div>
      <div
        className="ag-theme-alpine"
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
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={{ flex: 1, resizable: true }}
        />
      </div>
      <div className="nav">
        <button className="back-btn" onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={next}>{strings.next}</button>
        <button className="skip-btn" onClick={next}>{strings.skip}</button>
      </div>
    </div>
  );
}
