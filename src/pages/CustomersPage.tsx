import strings from '../../res/strings';

interface Props {
  next: () => void;
  back: () => void;
}

function CustomersPage({ next, back }: Props) {
  return (
    <div>
      <h2>{strings.customers}</h2>
      <p>Coming soon.</p>
      <div className="nav">
        <button className="next-btn" onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={next}>{strings.next}</button>
        <button className="skip-btn" onClick={next}>{strings.skip}</button>
      </div>
    </div>
  );
}

export default CustomersPage;
