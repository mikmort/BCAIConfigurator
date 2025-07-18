import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

interface Props {
  values: string[];
}

const DatalistCellEditor = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const [value, setValue] = useState(props.values.includes(props.value) ? props.value : props.value || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useRef('list-' + Math.random().toString(36).slice(2));

  useImperativeHandle(ref, () => ({
    getValue: () => value,
    afterGuiAttached: () => {
      inputRef.current?.focus();
      inputRef.current?.select();
    },
  }));

  return (
    <>
      <input
        ref={inputRef}
        list={listId.current}
        value={value}
        onChange={e => setValue(e.target.value)}
        style={{ width: '100%' }}
      />
      <datalist id={listId.current}>
        {props.values.map(v => (
          <option key={v} value={v} />
        ))}
      </datalist>
    </>
  );
});

export default DatalistCellEditor;
