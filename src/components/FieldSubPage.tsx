import React from 'react';
import { CompanyField } from '../types';

import strings from '../../res/strings';

interface Props {
  field: CompanyField;
  renderInput: (cf: CompanyField) => React.ReactNode;
  onConfirm: () => void;
  onSkip: () => void;
  onBack: () => void;
  onRecommended?: () => void;
  confirmLabel?: string;
  confirmed?: boolean;
}

function FieldSubPage({
  field: cf,
  renderInput,
  onConfirm,
  onSkip,
  onBack,
  onRecommended,
  confirmLabel = 'Confirm',
  confirmed,
}: Props) {
  return (
    <div className="subpage-field">
      <div className="subpage-left">
        {confirmed && (
          <div className="confirmed-banner">Confirmed!</div>
        )}
        <div className="question"><strong>{cf.question}</strong></div>
        <div className="input-area">{renderInput(cf)}</div>
        <div className="field-ref">{cf.field}</div>
        <div className="details-divider">{strings.details}</div>
        {cf.recommended && (
          <div className="recommended">
            Recommended: {cf.recommended}{' '}
            <span
              className="icon"
              role="button"
              title="Use recommended value"
              onClick={onRecommended}
            >
              ⭐
            </span>
          </div>
        )}
      </div>
      <div className="subpage-considerations">{cf.considerations}</div>
      <div className="nav">
        <button className="next-btn" onClick={onBack}>{strings.back}</button>
        <button className="next-btn" onClick={onConfirm}>{confirmLabel}</button>
        <button className="skip-btn" onClick={onSkip}>Skip</button>
      </div>
    </div>
  );
}

export default FieldSubPage;
