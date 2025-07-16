import strings from '../../res/strings';
import { BasicInfo } from '../types';
import React, { useState } from 'react';

interface Props {
  formData: BasicInfo;
  handleChange: (e: any) => void;
  handleBlur: (e: any) => void;
  next: () => void;
  back: () => void;
}

const initialIndustries = [
  'Manufacturing',
  'Retail',
  'Healthcare',
  'Education',
  'Finance',
  'Technology',
  'Hospitality',
  'Construction',
  'Transportation',
  'Government',
];

function BasicInfoPage({
  formData: data,
  handleChange,
  handleBlur,
  next,
  back,
}: Props) {
  const [industries, setIndustries] = useState(initialIndustries);

  function handleIndustryBlur(e: any) {
    handleBlur(e);
    const val = e.target.value.trim();
    if (val && !industries.includes(val)) {
      setIndustries([...industries, val]);
    }
  }
  return (
    <div>
      <h2>{strings.basicInfoTitle}</h2>
      <div className="field-row">
        <div className="field-name">{strings.companyNameLabel}</div>
        <div className="field-input">
          <input
            name="companyName"
            value={data.companyName || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        <div className="field-considerations" />
      </div>
      <div className="field-row">
        <div className="field-name">{strings.industryLabel}</div>
        <div className="field-input">
          <input
            list="industry-list"
            name="industry"
            value={data.industry || ''}
            onChange={handleChange}
            onBlur={handleIndustryBlur}
          />
          <datalist id="industry-list">
            {industries.map(ind => (
              <option value={ind} key={ind} />
            ))}
          </datalist>
        </div>
        <div className="field-considerations" />
      </div>
      <div className="field-row">
        <div className="field-name">{strings.websiteLabel}</div>
        <div className="field-input">
          <input
            type="url"
            name="websiteUrl"
            value={data.websiteUrl || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        <div className="field-considerations" />
      </div>
      <div className="field-row">
        <div className="field-name">{strings.descriptionLabel}</div>
        <div className="field-input">
          <textarea
            name="description"
            rows={8}
            value={data.description || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        <div className="field-considerations">{strings.descriptionHint}</div>
      </div>
      <div className="nav">
        <button onClick={back}>{strings.back}</button>
        <button onClick={next}>{strings.next}</button>
      </div>
    </div>
  );
}

export default BasicInfoPage;
