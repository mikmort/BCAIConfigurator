import strings from '../../res/strings';

interface Props {
  formData: { [key: string]: any };
  handleChange: (e: any) => void;
  handleBlur: (e: any) => void;
  next: () => void;
  back: () => void;
  askAI: (field: string, key: string, value: string, cons?: string) => void;
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
          <button
            type="button"
            className="ai-btn"
            title="Ask AI to help"
            onClick={() =>
              askAI(
                strings.generalPostingGroupLabel,
                'postingGroup',
                formData.postingGroup || ''
              )
            }
          >
            <span className="icon">✨</span>
            Ask AI to help
          </button>
        </div>
        <div className="field-considerations"></div>
      </div>
      <div className="nav">
        <button className="next-btn" onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={next}>{strings.next}</button>
        <button className="skip-btn" onClick={next}>{strings.skip}</button>
      </div>
    </div>
  );
}

export default PostingGroupsPage;
