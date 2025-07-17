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
  goToReview: () => void;
}

function CompanyInfoPage({
  fields,
  renderInput,
  next,
  back,
  progress,
  setProgress,
  visited,
  setVisited,
  handleRecommended,
  goToReview,
}: Props) {
  return (
    <FieldWizard
      title={strings.companyInfo}
      fields={fields}
      renderInput={renderInput}
      handleRecommended={handleRecommended}
      next={next}
      back={back}
      progress={progress}
      setProgress={setProgress}
      visited={visited}
      setVisited={setVisited}
      goToReview={goToReview}
    />
  );
}

export default CompanyInfoPage;
