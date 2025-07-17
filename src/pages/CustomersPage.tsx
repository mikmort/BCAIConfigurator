import strings from '../../res/strings';

interface Props {
  next: () => void;
  back: () => void;
}

function CustomersPage({ next, back }: Props) {
  return (
    <div>
      <div className="section-header">{strings.customers}</div>
      <p>Coming soon.</p>
      <div className="nav">
        <button className="back-btn" onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={next}>{strings.next}</button>
        <button className="skip-btn" onClick={next}>{strings.skip}</button>
      </div>
    </div>
  );
}

export default CustomersPage;
