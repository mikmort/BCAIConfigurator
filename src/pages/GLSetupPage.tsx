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
  visited: boolean[];
  setVisited: (arr: boolean[]) => void;
  handleRecommended: (cf: CompanyField) => void;
}

function GLSetupPage({ fields, renderInput, next, back, progress, setProgress, visited, setVisited, handleRecommended }: Props) {
  return (
    <FieldWizard
      title={strings.generalLedgerSetup}
      fields={fields}
      renderInput={renderInput}
      handleRecommended={handleRecommended}
      next={next}
      back={back}
      skipSection={back}
      progress={progress}
      setProgress={setProgress}
      visited={visited}
      setVisited={setVisited}
    />
  );
}

export default GLSetupPage;
