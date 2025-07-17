import strings from '../../res/strings';

interface Props {
  formData: { [key: string]: any };
  handleChange: (e: any) => void;
  handleBlur: (e: any) => void;
  next: () => void;
  back: () => void;
  askAI: (field: string, key: string, cons?: string) => void;
}

function PostingGroupsPage({
  formData,
  handleChange,
  handleBlur,
  next,
  back,
  askAI,
}: Props) {
  return (
    <div>
      <h2>{strings.postingGroups}</h2>
      <div className="field-row">
        <div className="field-name">{strings.generalPostingGroupLabel}</div>
        <div className="field-input">
          <input
            name="postingGroup"
            value={formData.postingGroup || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <span className="icon" role="button" title="Use recommended value">⭐</span>
          <span
            className="icon"
            role="button"
            title="Ask AI"
            onClick={() => askAI(strings.generalPostingGroupLabel, 'postingGroup')}
          >
            🤖
          </span>
        </div>
        <div className="field-considerations"></div>
      </div>
      <div className="nav">
        <button onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={next}>{strings.next}</button>
        <button className="skip-link" onClick={next}>{strings.skip}</button>
      </div>
    </div>
  );
}

export default PostingGroupsPage;
