import React from 'react';
import strings from '../../res/strings';

interface Props {
  formData: { [key: string]: any };
  handleChange: (e: any) => void;
  handleBlur: (e: any) => void;
  next: () => void;
  back: () => void;
  askAI: (field: string, key: string, value: string, cons?: string) => void;
  autoSuggest: (
    field: string,
    key: string,
    value: string,
    cons?: string
  ) => Promise<{ suggested: string; confidence: string }>;
  setFieldValue: (key: string, value: string) => void;
}

function PostingGroupsPage({
  formData,
  handleChange,
  handleBlur,
  next,
  back,
  askAI,
  autoSuggest,
  setFieldValue,
}: Props) {
  const [auto, setAuto] = React.useState<{ suggested: string; confidence: string } | null>(null);

  React.useEffect(() => {
    let mounted = true;
    autoSuggest(
      strings.generalPostingGroupLabel,
      'postingGroup',
      formData.postingGroup || ''
    )
      .then(res => {
        if (mounted) setAuto(res);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const showAuto =
    auto && auto.suggested && /^(very high|high)$/i.test(auto.confidence || '');

  return (
    <div>
      <div className="section-header">{strings.postingGroups}</div>
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
          <div className="auto-suggest">
            {showAuto && (
              <>
                <span>AI Recommends: {auto!.suggested}</span>
                <button type="button" onClick={() => setFieldValue('postingGroup', auto!.suggested)}>
                  Accept
                </button>
              </>
            )}
          </div>
        </div>
        <div className="field-considerations"></div>
      </div>
      <div className="nav">
        <button className="back-btn" onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={next}>{strings.next}</button>
        <button className="skip-btn" onClick={next}>{strings.skip}</button>
      </div>
    </div>
  );
}

export default PostingGroupsPage;
