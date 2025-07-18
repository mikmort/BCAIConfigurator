import GettingStartImage from '../images/GettingStartImage.jpg';
import strings from '../../res/strings';
import { PrimaryButton } from '@fluentui/react';

interface Props {
  next: () => void;
}

function HomePage({ next }: Props) {
  return (
    <div className="splash-screen">
      <div className="splash-inner">
        <div className="splash-content">
          <h1>{strings.appTitle}</h1>
          <p>{strings.splashWelcome}</p>
          <PrimaryButton onClick={next} text={strings.getStarted} />
        </div>
        <img
          className="splash-image"
          src={GettingStartImage}
          alt="Getting started"
        />
      </div>
      <p className="splash-terms">Use of this tool is subject to standard terms of service. ExampleCo is not responsible for any data loss.</p>
    </div>
  );
}

export default HomePage;
