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
      <label>
        General Posting Group:
        <input name="postingGroup" value={formData.postingGroup || ''} onChange={handleChange} />
      </label>
      <div className="nav">
        <button onClick={back}>Back</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
}

export default PostingGroupsPage;
