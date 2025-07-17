import React, { useState, useEffect } from 'react';
import { CompanyField } from '../types';
import FieldSubPage from './FieldSubPage';
import ReviewPage from '../pages/ReviewPage';
import strings from '../../res/strings';

interface Props {
  title: string;
  fields: CompanyField[];
  renderInput: (cf: CompanyField) => React.ReactNode;
  next: () => void;
  back: () => void;
  skipSection: () => void;
  progress: boolean[];
  setProgress: (arr: boolean[]) => void;
  visited: boolean[];
  setVisited: (arr: boolean[]) => void;
  handleRecommended: (cf: CompanyField) => void;
  formData: { [key: string]: any };
  onShowSometimes?: () => void;
  /**
   * Optional index of a field to jump to when the wizard renders.
   * Only applies to the common fields stage.
   */
  goToFieldIndex?: number | null;
}


function FieldWizard({
  title,
  fields,
  renderInput,
  next,
  back,
  skipSection,
  progress,
  setProgress,
  visited,
  setVisited,
  handleRecommended,
  formData,
  onShowSometimes,
  goToFieldIndex,
}: Props) {

  const common = fields.filter(f => f.common === 'common');
  const sometimes = fields.filter(f => f.common === 'sometimes');
  const unlikely = fields.filter(f => f.common === 'unlikely');

  type Stage = 'common' | 'finish' | 'sometimes' | 'unlikely' | 'review';
  const [stage, setStage] = useState<Stage>(() =>
    progress.every(Boolean) ? 'finish' : 'common'
  );

  const [cIdx, setCIdx] = useState(() => {
    const idx = progress.findIndex(v => !v);
    return idx === -1 ? 0 : idx;
  });
  const [sIdx, setSIdx] = useState(0);
  const [uIdx, setUIdx] = useState(0);
  const [sDone, setSDone] = useState(false);
  const [uDone, setUDone] = useState(false);

  function openReview() {
    setStage('review');
  }

  useEffect(() => {
    if (goToFieldIndex !== undefined && goToFieldIndex !== null) {
      const idx = goToFieldIndex;
      if (idx >= 0 && idx < common.length) {
        setStage('common');
        setCIdx(idx);
      }
    }
  }, [goToFieldIndex, common.length]);


  const stageProgress = (() => {
    if (stage === 'common') {
      return { done: progress.filter(Boolean).length, total: common.length };
    }
    if (stage === 'sometimes') {
      return { done: sIdx, total: sometimes.length };
    }
    if (stage === 'unlikely') {
      return { done: uIdx, total: unlikely.length };
    }
    return { done: 0, total: 0 };
  })();

  const progressPct = stageProgress.total
    ? Math.round((stageProgress.done / stageProgress.total) * 100)
    : 100;

  function confirmCommon() {
    const arr = [...progress];
    const vArr = [...visited];
    arr[cIdx] = true;
    vArr[cIdx] = true;
    setProgress(arr);
    setVisited(vArr);
    nextCommon(vArr);
  }
  function skipCommon() {
    const vArr = [...visited];
    vArr[cIdx] = true;
    setVisited(vArr);
    nextCommon(vArr);
  }
  function nextCommon(current: boolean[] = visited) {
    const idx = current.findIndex(v => !v);
    if (idx === -1) setStage('finish');
    else setCIdx(idx);
  }
  function backCommon() {
    if (cIdx > 0) setCIdx(cIdx - 1);
    else back();
  }

  function reviewSometimes() {
    onShowSometimes && onShowSometimes();
    setStage('sometimes');
    setSIdx(0);
  }
  function confirmSome() {
    nextSome();
  }
  function skipSome() {
    nextSome();
  }
  function nextSome() {
    if (sIdx + 1 < sometimes.length) setSIdx(sIdx + 1);
    else {
      setSDone(true);
      openReview();
    }
  }
  function backSome() {
    if (sIdx > 0) setSIdx(sIdx - 1);
    else setStage('finish');
  }

  function reviewUnlikely() {
    setStage('unlikely');
    setUIdx(0);
  }
  function confirmUnlikelyField() {
    nextUnlikely();
  }
  function skipUnlikelyField() {
    nextUnlikely();
  }
  function nextUnlikely() {
    if (uIdx + 1 < unlikely.length) setUIdx(uIdx + 1);
    else {
      setUDone(true);
      openReview();
    }
  }
  function backUnlikely() {
    if (uIdx > 0) setUIdx(uIdx - 1);
    else setStage('finish');
  }

  function skipSometimes() {
    setSDone(true);
    openReview();
  }

  function skipUnlikely() {
    setUDone(true);
    openReview();
  }

  return (
    <div>
      <div className="section-header">{title}</div>

      {stage === 'common' && common[cIdx] && (
        <FieldSubPage
          field={common[cIdx]}
          renderInput={renderInput}
          onConfirm={confirmCommon}
          onBack={backCommon}
          onRecommended={() => handleRecommended(common[cIdx])}
          onSkip={skipCommon}
          onSkipSection={skipSection}
          confirmLabel={cIdx === common.length - 1 ? 'Confirm and Finish' : 'Confirm'}
          confirmed={progress[cIdx]}
        />
      )}

      {stage === 'sometimes' && sometimes[sIdx] && (
        <FieldSubPage
          field={sometimes[sIdx]}
          renderInput={renderInput}
          onConfirm={confirmSome}
          onBack={backSome}
          onRecommended={() => handleRecommended(sometimes[sIdx])}
          onSkip={skipSome}
          onSkipSection={skipSection}
          confirmLabel={sIdx === sometimes.length - 1 ? 'Confirm and Finish' : 'Confirm'}
        />
      )}

      {stage === 'unlikely' && unlikely[uIdx] && (
        <FieldSubPage
          field={unlikely[uIdx]}
          renderInput={renderInput}
          onConfirm={confirmUnlikelyField}
          onBack={backUnlikely}
          onRecommended={() => handleRecommended(unlikely[uIdx])}
          onSkip={skipUnlikelyField}
          onSkipSection={skipSection}
          confirmLabel={uIdx === unlikely.length - 1 ? 'Confirm and Finish' : 'Confirm'}
        />
      )}

      {stage === 'finish' && (
        <div className="finish-summary">
          <div className="congrats-message">
            <span className="icon" role="img" aria-label="celebration">
              🎉
            </span>{' '}
            Congratulations
          </div>
          <p className="completed-text">
            Completed {progress.filter(Boolean).length} of {common.length} tasks
          </p>
          {!sDone && sometimes.length > 0 && (
            <div className="finish-section">
              <p>
                Below are a list of additional fields that some companies
                configure when setting up Dynamics Business Central. Would you
                like to review these now?
              </p>
              <ul>
                {sometimes.map(f => (
                  <li key={f.field}>{f.field}</li>
                ))}
              </ul>
              <div className="nav">
                <button className="next-btn" onClick={reviewSometimes}>Yes</button>
                <button className="next-btn" onClick={skipSometimes}>
                  No, let's finish and Review
                </button>
              </div>
            </div>
          )}

          {/* No other actions when skipping */}
        </div>
      )}

      {stage === 'review' && (
        <ReviewPage
          fields={fields}
          formData={formData}
          back={() => setStage('finish')}
          next={next}
        />
      )}

      {(stage === 'common' || stage === 'sometimes' || stage === 'unlikely') && (
        <div className="completion-text">
          {stageProgress.done} of {stageProgress.total} tasks completed
        </div>
      )}
    </div>
  );
}

export default FieldWizard;
