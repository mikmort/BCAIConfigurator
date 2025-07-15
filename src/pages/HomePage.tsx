interface Props {
  next: () => void;
}

function HomePage({ next }: Props) {
  return (
    <div>
      <p>Welcome! This wizard will help you configure Dynamics 365 Business Central.</p>
      <button onClick={next}>Start</button>
    </div>
  );
}

export default HomePage;
