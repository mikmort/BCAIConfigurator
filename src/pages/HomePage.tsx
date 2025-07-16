import GettingStartImage from '../images/GettingStartImage.jpg';

interface Props {
  next: () => void;
}

function HomePage({ next }: Props) {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <h1>Business Central Setup</h1>
        <p>
          Welcome! This wizard will help you configure Dynamics 365 Business
          Central.
        </p>
        <button className="splash-button" onClick={next}>
          Get Started
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
