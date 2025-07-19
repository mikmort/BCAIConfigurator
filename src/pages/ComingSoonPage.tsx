import strings from '../../res/strings';

interface Props {
  title: string;
  next: () => void;
  back: () => void;
}

export default function ComingSoonPage({ title, next, back }: Props) {
  return (
    <div>
      <div className="section-header">{title}</div>
      <p>{strings.comingSoon}</p>
      <div className="nav">
        <button className="back-btn" onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={next}>{strings.next}</button>
        <button className="skip-btn" onClick={next}>{strings.skip}</button>
      </div>
    </div>
  );
}
