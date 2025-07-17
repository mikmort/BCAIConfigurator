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
        <button onClick={back}>{strings.back}</button>
        <button onClick={next}>{strings.next}</button>
      </div>
    </div>
  );
}

export default CustomersPage;
