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
  formData: { [key: string]: any };
  onShowSometimes: () => void;
  fetchAISuggestion: (
    field: CompanyField,
    currentValue: string
  ) => Promise<{ suggested: string; confidence: string }>;
  setFieldValue: (key: string, value: string) => void;
  goToFieldIndex?: number | null;
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
  formData,
  onShowSometimes,
  fetchAISuggestion,
  setFieldValue,
  goToFieldIndex,
}: Props) {
  return (
    <FieldWizard
      title={strings.companyInfo}
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
      formData={formData}
      onShowSometimes={onShowSometimes}
      fetchAISuggestion={fetchAISuggestion}
      setFieldValue={setFieldValue}
      goToFieldIndex={goToFieldIndex}
    />
  );
}

export default CompanyInfoPage;
