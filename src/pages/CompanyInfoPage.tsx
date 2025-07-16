import { CompanyField } from '../types';
import strings from '../../res/strings';

interface FormData {
  [key: string]: any;
}

interface Props {
  fields: CompanyField[];
  formData: FormData;
  handleChange: (e: any) => void;
  renderField: (cf: CompanyField) => any;
  next: () => void;
  back: () => void;
}

function CompanyInfoPage({
  fields,
  formData,
  handleChange,
  renderField,
  next,
  back,
}: Props) {
  return (
    <div>
      <h2>{strings.companyInfo}</h2>
      <h3>{strings.common}</h3>
      {fields.filter(cf => cf.common === 'common').map(renderField)}
      <details>
        <summary>{strings.sometimes}</summary>
        {fields.filter(cf => cf.common === 'sometimes').map(renderField)}
      </details>
      <details>
        <summary>{strings.additional}</summary>
        {fields.filter(cf => cf.common === 'unlikely').map(renderField)}
      </details>
      <div className="nav">
        <button onClick={back}>{strings.back}</button>
        <button onClick={next}>{strings.next}</button>
      </div>
    </div>
  );
}

export default CompanyInfoPage;
