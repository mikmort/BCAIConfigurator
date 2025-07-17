import React, { useState } from 'react';
import { CompanyField } from '../types';
import FieldSubPage from './FieldSubPage';
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
}

function FieldWizard({ title, fields, renderInput, next, back, skipSection, progress, setProgress, visited, setVisited, handleRecommended }: Props) {
  const common = fields.filter(f => f.common === 'common');
  const sometimes = fields.filter(f => f.common === 'sometimes');
  const unlikely = fields.filter(f => f.common === 'unlikely');

  type Stage = 'common' | 'finish' | 'sometimes' | 'unlikely';
  const [stage, setStage] = useState<Stage>(() =>
    visited.every(Boolean) ? 'finish' : 'common'
  );

  const [cIdx, setCIdx] = useState(() => {
    const idx = visited.findIndex(v => !v);
    return idx === -1 ? 0 : idx;
  });
  const [sIdx, setSIdx] = useState(0);
  const [uIdx, setUIdx] = useState(0);
  const [sDone, setSDone] = useState(false);
  const [uDone, setUDone] = useState(false);


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
      setStage('finish');
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
      next();
    }
  }
  function backUnlikely() {
    if (uIdx > 0) setUIdx(uIdx - 1);
    else setStage('finish');
  }

  function skipSometimes() {
    setSDone(true);
  }

  function skipUnlikely() {
    setUDone(true);
    next();
  }

  return (
    <div>
      <h2>{title}</h2>

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
          <p>
            Completed {progress.filter(Boolean).length} of {common.length} tasks
          </p>
          {!sDone && sometimes.length > 0 && (
            <div className="finish-section">
              <h3>{strings.sometimes}</h3>
              <ul>
                {sometimes.map(f => (
                  <li key={f.field}>{f.field}</li>
                ))}
              </ul>
              <p>
                These files are sometimes customized on setup. Would you like to
                review these fields as well, or skip for now?
              </p>
              <div className="nav">
                <button className="next-btn" onClick={reviewSometimes}>Review</button>
                <button className="skip-btn" onClick={skipSometimes}>Skip</button>
              </div>
            </div>
          )}

          {sDone && !uDone && unlikely.length > 0 && (
            <div className="finish-section">
              <h3>{strings.additional}</h3>
              <ul>
                {unlikely.map(f => (
                  <li key={f.field}>{f.field}</li>
                ))}
              </ul>
              <p>
                These files are rarely customized on setup. Would you like to
                review these fields, or skip for now?
              </p>
              <div className="nav">
                <button className="next-btn" onClick={reviewUnlikely}>Review</button>
                <button className="skip-btn" onClick={skipUnlikely}>Skip</button>
              </div>
            </div>
          )}

          {sDone && (uDone || unlikely.length === 0) && (
            <div className="nav">
              <button className="next-btn" onClick={next}>{strings.next}</button>
            </div>
          )}
        </div>
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
