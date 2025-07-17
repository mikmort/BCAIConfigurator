import { CompanyField } from '../types';
import strings from '../../res/strings';
import FieldWizard from '../components/FieldWizard';

interface FormData {
  [key: string]: any;
}

interface Props {
  fields: CompanyField[];
  renderInput: (cf: CompanyField) => any;
  next: () => void;
  back: () => void;
}

function CompanyInfoPage({ fields, renderInput, next, back }: Props) {
  return (
    <FieldWizard
      title={strings.companyInfo}
      fields={fields}
      renderInput={renderInput}
      next={next}
      back={back}
    />
  );
}

export default CompanyInfoPage;
