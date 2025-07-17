import { CompanyField } from '../types';
import strings from '../../res/strings';
import FieldWizard from '../components/FieldWizard';

interface FormData { [key: string]: any }

interface Props {
  fields: CompanyField[];
  renderInput: (cf: CompanyField) => any;
  next: () => void;
  back: () => void;
  progress: boolean[];
  setProgress: (arr: boolean[]) => void;
}

function SalesReceivablesPage({ fields, renderInput, next, back, progress, setProgress }: Props) {
  return (
    <FieldWizard
      title={strings.salesReceivablesSetup}
      fields={fields}
      renderInput={renderInput}
      next={next}
      back={back}
      progress={progress}
      setProgress={setProgress}
    />
  );
}

export default SalesReceivablesPage;
