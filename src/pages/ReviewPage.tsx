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
  const map: Record<string, string> = {};
  fields.forEach(f => {
    map[fieldKey(f.field)] = f.field;
  });
  const entries = Object.keys(formData).map(k => ({
    name: map[k] || k,
    value: formData[k],
  }));

  return (
    <div>
      <h2>{strings.review}</h2>
      <ul>
        {entries.map(e => (
          <li key={e.name}>
            <strong>{e.name}:</strong> {String(e.value)}
          </li>
        ))}
      </ul>
      <div className="nav">
        <button className="next-btn" onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={next}>I'm good for now</button>
      </div>
    </div>
  );
}

export default ReviewPage;
