import { CompanyField } from '../types';
import FieldWizard from '../components/FieldWizard';

export interface WizardPageProps {
  title: string;
  fields: CompanyField[];
  renderInput: (cf: CompanyField) => any;
  next: () => void;
  back: () => void;
  skipSection?: () => void; // maybe not needed but we replicate
  progress: boolean[];
  setProgress: (arr: boolean[]) => void;
  visited: boolean[];
  setVisited: (arr: boolean[]) => void;
  handleRecommended: (cf: CompanyField) => void;
  formData: { [key: string]: any };
  onShowSometimes?: () => void;
  fetchAISuggestion: (
    field: CompanyField,
    currentValue: string
  ) => Promise<{ suggested: string; confidence: string; reasoning: string }>;
  setFieldValue: (key: string, value: string) => void;
  onFieldIndexChange: (index: number | null) => void;
  goToFieldIndex?: number | null;
}

function WizardPage({ title, fields, renderInput, next, back, skipSection = back, ...rest }: WizardPageProps) {
  return (
    <FieldWizard
      title={title}
      fields={fields}
      renderInput={renderInput}
      handleRecommended={rest.handleRecommended}
      next={next}
      back={back}
      skipSection={skipSection}
      progress={rest.progress}
      setProgress={rest.setProgress}
      visited={rest.visited}
      setVisited={rest.setVisited}
      formData={rest.formData}
      onShowSometimes={rest.onShowSometimes}
      fetchAISuggestion={rest.fetchAISuggestion}
      setFieldValue={rest.setFieldValue}
      onFieldIndexChange={rest.onFieldIndexChange}
      goToFieldIndex={rest.goToFieldIndex}
    />
  );
}

export default WizardPage;
