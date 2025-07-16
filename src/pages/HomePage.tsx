import GettingStartImage from '../images/GettingStartImage.jpg';
import strings from '../../res/strings';

interface Props {
  next: () => void;
}

function HomePage({ next }: Props) {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <h1>{strings.appTitle}</h1>
        <p>{strings.splashWelcome}</p>
        <button className="splash-button" onClick={next}>
          {strings.getStarted}
        </button>
      </div>
      <img
        className="splash-image"
        src={GettingStartImage}
        alt="Getting started"
      />
    </div>
  );
}

export default HomePage;
