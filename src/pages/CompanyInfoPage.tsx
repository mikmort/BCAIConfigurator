import { CompanyField } from '../types';
import strings from '../../res/strings';

interface FormData {
  [key: string]: any;
}

interface Props {
  fields: CompanyField[];
  commonFieldNames: Set<string>;
  formData: FormData;
  handleChange: (e: any) => void;
  renderField: (cf: CompanyField) => any;
  next: () => void;
  back: () => void;
}

function CompanyInfoPage({
  fields,
  commonFieldNames,
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
      {fields.filter(cf => commonFieldNames.has(cf.field)).map(renderField)}
      <h3>{strings.additional}</h3>
      {fields.filter(cf => !commonFieldNames.has(cf.field)).map(renderField)}
      <div className="nav">
        <button onClick={back}>{strings.back}</button>
        <button onClick={next}>{strings.next}</button>
      </div>
    </div>
  );
}

export default CompanyInfoPage;
