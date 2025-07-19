import GettingStartImage from '../images/GettingStartImage.jpg';
import strings from '../../res/strings';

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
          <button className="next-btn" onClick={next}>
            {strings.getStarted}
          </button>
        </div>
        <img
          className="splash-image"
          src={GettingStartImage}
          alt="Getting started"
        />
      </div>
      <p className="splash-terms">{strings.termsOfUse}</p>
    </div>
  );
}

export default HomePage;
