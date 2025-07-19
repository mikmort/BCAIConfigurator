import React from 'react';
import { CompanyField } from '../types';
import { fieldKey } from '../utils/helpers';

interface Props {
  title: string;
  fields: CompanyField[];
  formData: { [key: string]: any };
  hideUncommon: boolean;
  onUseDefaults: () => void;
  onReview: () => void;
  onSkip: () => void;
}

export default function OptionalSetupPage({
  title,
  fields,
  formData,
  hideUncommon,
  onUseDefaults,
  onReview,
  onSkip,
}: Props) {
  const visibleFields = hideUncommon
    ? fields.filter(f => f.common === 'common')
    : fields;
  return (
    <div>
      <div className="section-header">{title}</div>
      <div className="question">
        <div className="question-main">
          {`Configuring data for "${title}" is optional. Below is the preconfigured data. Would like to use the defaults or go through and review all the choices?`}
        </div>
      </div>
      <table className="defaults-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {visibleFields.map(f => {
            const val = formData[fieldKey(f.field)];
            const displayValue =
              f.fieldType === 'Boolean'
                ? val === '1' || val === 1 || val === true
                  ? 'True'
                  : val === '0' || val === 0 || val === false
                  ? 'False'
                  : ''
                : String(val ?? '');
            return (
              <tr key={f.field}>
                <td>{f.question}</td>
                <td>{f.field}</td>
                <td>{displayValue}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="nav">
        <button className="next-btn" onClick={onUseDefaults}>Use the defaults</button>
        <button className="next-btn" onClick={onReview}>Review all the choices</button>
        <button className="skip-btn skip-right" onClick={onSkip}>Decide later</button>
      </div>
    </div>
  );
}
