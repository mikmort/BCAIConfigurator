import { CompanyField } from '../types';
import strings from '../../res/strings';

interface FormData { [key: string]: any }

interface Props {
  fields: CompanyField[];
  commonFieldNames: Set<string>;
  formData: FormData;
  handleChange: (e: any) => void;
  renderField: (cf: CompanyField) => any;
  next: () => void;
  back: () => void;
}

function GLSetupPage({ fields, commonFieldNames, formData, handleChange, renderField, next, back }: Props) {
  return (
    <div>
      <h2>{strings.generalLedgerSetup}</h2>
      <h3>{strings.common}</h3>
      {fields.filter(cf => commonFieldNames.has(cf.field)).map(renderField)}
      <details>
        <summary>{strings.additional}</summary>
        {fields
          .filter(cf => !commonFieldNames.has(cf.field))
          .map(renderField)}
      </details>
      <div className="nav">
        <button onClick={back}>{strings.back}</button>
        <button onClick={next}>{strings.next}</button>
      </div>
    </div>
  );
}

export default GLSetupPage;
