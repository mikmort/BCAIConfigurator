import strings from '../../res/strings';

interface Props {
  next: () => void;
  back: () => void;
  skipSection: () => void;
}

function ItemsPage({ next, back, skipSection }: Props) {
  return (
    <div>
      <h2>{strings.items}</h2>
      <p>Coming soon.</p>
      <div className="nav">
        <button className="next-btn" onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={next}>{strings.next}</button>
        <button className="skip-btn skip-section-btn" onClick={skipSection}>
          {strings.skipSection}
        </button>
        <button className="skip-btn" onClick={next}>{strings.skip}</button>
      </div>
    </div>
  );
}

export default ItemsPage;
