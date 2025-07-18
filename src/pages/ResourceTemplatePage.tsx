import strings from '../../res/strings';
import ComingSoonPage from './ComingSoonPage';

interface Props {
  next: () => void;
  back: () => void;
}

export default function ResourceTemplatePage(props: Props) {
  return <ComingSoonPage {...props} title={strings.resourceTemplate} />;
}

