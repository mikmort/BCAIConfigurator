import strings from '../../res/strings';

interface Props {
  next: () => void;
  back: () => void;
}

function VendorsPage({ next, back }: Props) {
  return (
    <div>
      <h2>{strings.vendors}</h2>
      <p>Coming soon.</p>
      <div className="nav">
        <button onClick={back}>{strings.back}</button>
        <button onClick={next}>{strings.next}</button>
      </div>
    </div>
  );
}

export default VendorsPage;
