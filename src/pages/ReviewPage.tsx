import React from 'react';
import strings from '../../res/strings';
import { fieldKey } from '../utils/helpers';
import { CompanyField } from '../types';

interface Props {
  fields: CompanyField[];
  formData: { [key: string]: any };
  back: () => void;
  next: () => void;
}

function ReviewPage({ fields, formData, back, next }: Props) {
  const entries = fields.map(f => ({
    name: f.field,
    value: formData[fieldKey(f.field)],
  }));

  return (
    <div>
      <div className="section-header">{strings.review}</div>
      <ul>
        {entries.map(e => (
          <li key={e.name}>
            <strong>{e.name}:</strong> {String(e.value)}
          </li>
        ))}
      </ul>
      <div className="nav">
        <button className="back-btn" onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={next}>{strings.reviewDone}</button>
      </div>
    </div>
  );
}

export default ReviewPage;
