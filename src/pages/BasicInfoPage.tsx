import strings from '../../res/strings';
import { BasicInfo } from '../types';

interface Props {
  formData: BasicInfo;
  handleChange: (e: any) => void;
  next: () => void;
  back: () => void;
}

const industries = [
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

function BasicInfoPage({ formData: data, handleChange, next, back }: Props) {
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
            name="websiteUrl"
            value={data.websiteUrl || ''}
            onChange={handleChange}
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
