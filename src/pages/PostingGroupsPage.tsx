interface Props {
  formData: { [key: string]: any };
  handleChange: (e: any) => void;
  next: () => void;
  back: () => void;
}

function PostingGroupsPage({ formData, handleChange, next, back }: Props) {
  return (
    <div>
      <h2>Posting Groups</h2>
      <div className="field-row">
        <div className="field-name">General Posting Group</div>
        <div className="field-input">
          <input name="postingGroup" value={formData.postingGroup || ''} onChange={handleChange} />
          <span className="icon" role="button" title="Use recommended value">⭐</span>
          <span className="icon" role="button" title="Ask AI">🤖</span>
        </div>
        <div className="field-considerations"></div>
      </div>
      <div className="nav">
        <button onClick={back}>Back</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
}

export default PostingGroupsPage;
