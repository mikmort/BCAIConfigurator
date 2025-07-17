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

  const [cIdx, setCIdx] = useState(0);
  const [cDone, setCDone] = useState<boolean[]>(common.map(() => false));
  const [sIdx, setSIdx] = useState(0);
  const [uIdx, setUIdx] = useState(0);
  const [showSometimes, setShowSometimes] = useState(false);
  const [showUnlikely, setShowUnlikely] = useState(false);

  const progress = common.length
    ? Math.round((cDone.filter(Boolean).length / common.length) * 100)
    : 100;

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
  }

  function confirmSome() {
    nextSome();
  }
  function skipSome() {
    nextSome();
  }
  function nextSome() {
    if (sIdx + 1 < sometimes.length) setSIdx(sIdx + 1);
    else setShowSometimes(false);
  }

  function confirmUnlikely() {
    nextUnlikely();
  }
  function skipUnlikely() {
    nextUnlikely();
  }
  function nextUnlikely() {
    if (uIdx + 1 < unlikely.length) setUIdx(uIdx + 1);
    else setShowUnlikely(false);
  }

  return (
    <div>
      <h2>{title}</h2>
      {common[cIdx] && (
        <FieldSubPage
          field={common[cIdx]}
          renderInput={renderInput}
          onConfirm={confirmCommon}
          onSkip={skipCommon}
        />
      )}
      {!common[cIdx] && <div>{strings.allCommonComplete}</div>}

      <details open={showSometimes} onToggle={e => setShowSometimes(e.currentTarget.open)}>
        <summary>{strings.sometimes}</summary>
        {showSometimes && sometimes[sIdx] && (
          <FieldSubPage
            field={sometimes[sIdx]}
            renderInput={renderInput}
            onConfirm={confirmSome}
            onSkip={skipSome}
          />
        )}
      </details>

      <details open={showUnlikely} onToggle={e => setShowUnlikely(e.currentTarget.open)}>
        <summary>{strings.additional}</summary>
        {showUnlikely && unlikely[uIdx] && (
          <FieldSubPage
            field={unlikely[uIdx]}
            renderInput={renderInput}
            onConfirm={confirmUnlikely}
            onSkip={skipUnlikely}
          />
        )}
      </details>

      <div className="status-bar">
        <div className="status-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="nav">
        <button className="next-btn" onClick={back}>{strings.back}</button>
        <button className="next-btn" onClick={next}>{strings.next}</button>
      </div>
    </div>
  );
}

export default FieldWizard;
