import strings from '../../res/strings';
import { BasicInfo } from '../types';
import React, { useState } from 'react';
import {
  TextField,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
} from '@fluentui/react';

interface Props {
  formData: BasicInfo;
  handleChange: (e: any) => void;
  handleBlur: (e: any) => void;
  next: () => void;
  back: () => void;
}

const initialIndustries = [
  'Agriculture',
  'Automotive',
  'Construction',
  'Education',
  'Energy',
  'Finance',
  'Government',
  'Healthcare',
  'Hospitality',
  'Manufacturing',
  'Media and Communications',
  'Nonprofit',
  'Professional Services',
  'Real Estate',
  'Retail',
  'Technology',
  'Telecommunications',
  'Transportation',
];

function BasicInfoPage({
  formData: data,
  handleChange,
  handleBlur,
  next,
  back,
}: Props) {
  const [industries, setIndustries] = useState(initialIndustries);

  const industryOptions: IDropdownOption[] = industries.map(ind => ({
    key: ind,
    text: ind,
  }));

  function onIndustryChange(_e: any, option?: IDropdownOption): void {
    const synthetic = {
      target: { name: 'industry', value: option ? option.text : '' },
    } as any;
    handleChange(synthetic);
  }

  function onIndustryBlur(): void {
    const val = (data.industry || '').trim();
    const synthetic = { target: { name: 'industry', value: val } } as any;
    handleBlur(synthetic);
    if (val && !industries.includes(val)) {
      setIndustries([...industries, val]);
    }
  }
  return (
    <div>
      <div className="section-header">{strings.basicInfoTitle}</div>
      <div className="field-row">
        <div className="field-name">{strings.companyNameLabel}</div>
        <div className="field-input">
          <TextField
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
          <Dropdown
            selectedKey={data.industry || undefined}
            onChange={onIndustryChange}
            onBlur={onIndustryBlur}
            options={industryOptions}
          />
        </div>
        <div className="field-considerations" />
      </div>
      <div className="field-row">
        <div className="field-name">{strings.websiteLabel}</div>
        <div className="field-input">
          <TextField
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
          <TextField
            multiline
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
        <PrimaryButton onClick={next} text={strings.finishButton} />
      </div>
    </div>
  );
}

export default BasicInfoPage;
