import strings from '../../res/strings';

interface Props {
  formData: { [key: string]: any };
  handleChange: (e: any) => void;
  next: () => void;
  back: () => void;
  askAI: () => void;
}

function PostingGroupsPage({ formData, handleChange, next, back, askAI }: Props) {
  return (
    <div>
      <h2>{strings.postingGroups}</h2>
      <div className="field-row">
        <div className="field-name">{strings.generalPostingGroupLabel}</div>
        <div className="field-input">
          <input name="postingGroup" value={formData.postingGroup || ''} onChange={handleChange} />
          <span className="icon" role="button" title="Use recommended value">⭐</span>
          <span className="icon" role="button" title="Ask AI" onClick={askAI}>🤖</span>
        </div>
        <div className="field-considerations"></div>
      </div>
      <div className="nav">
        <button onClick={back}>{strings.back}</button>
        <button onClick={next}>{strings.next}</button>
      </div>
    </div>
  );
}

export default PostingGroupsPage;
