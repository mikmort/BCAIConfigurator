import React from 'react';
import { CompanyField } from '../types';
import { fieldKey } from '../utils/helpers';

interface Props {
  title: string;
  fields: CompanyField[];
  formData: { [key: string]: any };
  onUseDefaults: () => void;
  onReview: () => void;
  onSkip: () => void;
}

export default function OptionalSetupPage({
  title,
  fields,
  formData,
  onUseDefaults,
  onReview,
  onSkip,
}: Props) {
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
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {fields.map(f => (
            <tr key={f.field}>
              <td>{f.field}</td>
              <td>{String(formData[fieldKey(f.field)] || '')}</td>
            </tr>
          ))}
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
