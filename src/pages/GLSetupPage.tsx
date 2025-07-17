import strings from '../../res/strings';
import WizardPage, { WizardPageProps } from './WizardPage';

export default function GLSetupPage(
  props: Omit<WizardPageProps, 'title' | 'skipSection'>
) {
  return <WizardPage {...props} title={strings.generalLedgerSetup} />;
}
