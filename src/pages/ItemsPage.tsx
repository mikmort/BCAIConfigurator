import strings from '../../res/strings';

interface Props {
  next: () => void;
  back: () => void;
}

function ItemsPage({ next, back }: Props) {
  return (
    <div>
      <h2>{strings.items}</h2>
      <p>Coming soon.</p>
      <div className="nav">
        <button onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={next}>{strings.next}</button>
        <button className="skip-link" onClick={next}>{strings.skip}</button>
      </div>
    </div>
  );
}

export default ItemsPage;
