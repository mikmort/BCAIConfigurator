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
}

function FieldWizard({ title, fields, renderInput, next, back }: Props) {
  const common = fields.filter(f => f.common === 'common');
  const sometimes = fields.filter(f => f.common === 'sometimes');
  const unlikely = fields.filter(f => f.common === 'unlikely');

  type Stage = 'common' | 'finish' | 'sometimes' | 'unlikely';
  const [stage, setStage] = useState<Stage>('common');

  const [cIdx, setCIdx] = useState(0);
  const [cDone, setCDone] = useState<boolean[]>(common.map(() => false));
  const [sIdx, setSIdx] = useState(0);
  const [uIdx, setUIdx] = useState(0);
  const [sDone, setSDone] = useState(false);
  const [uDone, setUDone] = useState(false);

  const confirmedCommon = cDone.filter(Boolean).length;
  let currentConfirmed = confirmedCommon;
  let currentTotal = common.length;
  let progress = currentTotal
    ? Math.round((currentConfirmed / currentTotal) * 100)
    : 100;

  if (stage === 'sometimes') {
    currentConfirmed = sIdx;
    currentTotal = sometimes.length;
    progress = currentTotal ? Math.round((currentConfirmed / currentTotal) * 100) : 100;
  } else if (stage === 'unlikely') {
    currentConfirmed = uIdx;
    currentTotal = unlikely.length;
    progress = currentTotal ? Math.round((currentConfirmed / currentTotal) * 100) : 100;
  }

  function confirmCommon() {
    const arr = [...cDone];
    arr[cIdx] = true;
    setCDone(arr);
    nextCommon();
  }
  function skipCommon() {
    nextCommon();
  }
  function nextCommon() {
    if (cIdx + 1 < common.length) setCIdx(cIdx + 1);
    else setStage('finish');
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
          onSkip={skipCommon}
          confirmLabel={cIdx === common.length - 1 ? 'Confirm and Finish' : 'Confirm'}
        />
      )}

      {stage === 'sometimes' && sometimes[sIdx] && (
        <FieldSubPage
          field={sometimes[sIdx]}
          renderInput={renderInput}
          onConfirm={confirmSome}
          onSkip={skipSome}
          confirmLabel={sIdx === sometimes.length - 1 ? 'Confirm and Finish' : 'Confirm'}
        />
      )}

      {stage === 'unlikely' && unlikely[uIdx] && (
        <FieldSubPage
          field={unlikely[uIdx]}
          renderInput={renderInput}
          onConfirm={confirmUnlikelyField}
          onSkip={skipUnlikelyField}
          confirmLabel={uIdx === unlikely.length - 1 ? 'Confirm and Finish' : 'Confirm'}
        />
      )}

      {stage === 'finish' && (
        <div className="finish-summary">
          <p>
            Completed {cDone.filter(Boolean).length} of {common.length} tasks
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
        <>
          <div className="status-bar">
            <div className="status-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="status-text">
            Completed {currentConfirmed} of {currentTotal} tasks
          </div>
        </>
      )}
    </div>
  );
}

export default FieldWizard;
