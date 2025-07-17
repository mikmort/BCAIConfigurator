import strings from '../../res/strings';
import WizardPage, { WizardPageProps } from './WizardPage';

export default function SalesReceivablesPage(
  props: Omit<WizardPageProps, 'title' | 'skipSection'>
) {
  return <WizardPage {...props} title={strings.salesReceivablesSetup} />;
}
