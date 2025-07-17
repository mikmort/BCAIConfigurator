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
  progress: boolean[];
  setProgress: (arr: boolean[]) => void;
  visited: boolean[];
  setVisited: (arr: boolean[]) => void;
  handleRecommended: (cf: CompanyField) => void;
  skipSection: () => void;
}

function CompanyInfoPage({ fields, renderInput, next, back, progress, setProgress, visited, setVisited, handleRecommended, skipSection }: Props) {
  return (
    <FieldWizard
      title={strings.companyInfo}
      fields={fields}
      renderInput={renderInput}
      handleRecommended={handleRecommended}
      next={next}
      back={back}
      skipSection={skipSection}
      progress={progress}
      setProgress={setProgress}
      visited={visited}
      setVisited={setVisited}
    />
  );
}

export default CompanyInfoPage;
