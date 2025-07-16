import { CompanyField } from '../types';
import strings from '../../res/strings';

interface FormData { [key: string]: any }

interface Props {
  fields: CompanyField[];
  formData: FormData;
  handleChange: (e: any) => void;
  renderField: (cf: CompanyField) => any;
  next: () => void;
  back: () => void;
}

function GLSetupPage({ fields, formData, handleChange, renderField, next, back }: Props) {
  return (
    <div>
      <h2>{strings.generalLedgerSetup}</h2>
      {fields.map(renderField)}
      <div className="nav">
        <button onClick={back}>{strings.back}</button>
        <button onClick={next}>{strings.next}</button>
      </div>
    </div>
  );
}

export default GLSetupPage;
