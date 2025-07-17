import React from 'react';
import { CompanyField } from '../types';

interface Props {
  field: CompanyField;
  renderInput: (cf: CompanyField) => React.ReactNode;
  onConfirm: () => void;
  onSkip: () => void;
}

function FieldSubPage({ field: cf, renderInput, onConfirm, onSkip }: Props) {
  return (
    <div className="subpage-field">
      <div className="subpage-left">
        <div className="question"><strong>{cf.question}</strong></div>
        <div className="field-ref">{cf.field}</div>
        {cf.recommended && (
          <div className="recommended">Recommended: {cf.recommended}</div>
        )}
        <div className="input-area">{renderInput(cf)}</div>
      </div>
      <div className="subpage-considerations">{cf.considerations}</div>
      <div className="nav">
        <button className="next-btn" onClick={onConfirm}>Confirm</button>
        <button className="skip-btn" onClick={onSkip}>Skip</button>
      </div>
    </div>
  );
}

export default FieldSubPage;
