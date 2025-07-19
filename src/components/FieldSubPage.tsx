import React, { useEffect, useState } from 'react';
import { CompanyField } from '../types';
import { fieldKey } from '../utils/helpers';

import strings from '../../res/strings';
import { LightbulbIcon, SparkleIcon, InfoIcon } from './Icons';
import InfoPopup from './InfoPopup';

interface Props {
  field: CompanyField;
  renderInput: (cf: CompanyField) => React.ReactNode;
  onConfirm: () => void;
  onSkip: () => void;
  onSkipSection: () => void;
  onBack: () => void;
  onRecommended?: () => void;
  formData?: { [key: string]: any };
  fetchAISuggestion?: (
    field: CompanyField,
    currentValue: string
  ) => Promise<{ suggested: string; confidence: string; reasoning: string }>;
  setFieldValue?: (key: string, value: string) => void;
  confirmLabel?: string;
  confirmed?: boolean;
}

function FieldSubPage({
  field: cf,
  renderInput,
  onConfirm,
  onSkip,
  onSkipSection,
  onBack,
  onRecommended,
  formData,
  fetchAISuggestion,
  setFieldValue,
  confirmLabel = strings.confirm,
  confirmed,
}: Props) {
  const isFinal = !confirmed && confirmLabel === strings.confirmAndFinish;
  const buttonLabel = confirmed ? strings.markNotConfirmed : confirmLabel;
  const [auto, setAuto] = useState<{ suggested: string; confidence: string; reasoning: string } | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const key = fieldKey(cf.field);
  const value = formData ? formData[key] || '' : '';

  useEffect(() => {
    let mounted = true;
    setAuto(null);
    if (fetchAISuggestion) {
      fetchAISuggestion(cf, value)
        .then(res => {
          if (mounted) setAuto(res);
        })
        .catch(() => {});
    }
    return () => {
      mounted = false;
    };
  }, [cf.field]);

  const showAuto =
    auto &&
    auto.suggested &&
    /^(very high|high)$/i.test(auto.confidence || '');
  return (
    <div className="subpage-field">
      <div className="subpage-left">
        {confirmed && (
          <div className="confirmed-banner">{strings.confirmedBanner}</div>
        )}
        <div className="question">
          {(() => {
            const q = cf.question || '';
            const match = q.match(/^(.*?\?)(\s*\((.*)\))?$/);
            const main = match ? match[1].trim() : q;
            const extra = match && match[3] ? match[3].trim() : '';
            return (
              <>
                <div className="question-main">{main}</div>
                {extra && <div className="question-extra">{extra}</div>}
              </>
            );
          })()}
        </div>
        <div className="input-area">{renderInput(cf)}</div>
        {showAuto && (
          <div className="auto-suggest">
            <SparkleIcon className="sparkle-icon" />
            <div>
              <strong>{strings.aiRecommends}</strong> {auto!.suggested}
              {auto!.reasoning && (
                <InfoIcon
                  className="info-icon"
                  title={auto!.reasoning}
                  onClick={() => setShowInfo(true)}
                />
              )}
              {setFieldValue && (
                <button
                  type="button"
                  onClick={() => setFieldValue(key, auto!.suggested)}
                >
                  {strings.acceptSuggestion}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {cf.considerations && (
        <div className="subpage-considerations">
          <LightbulbIcon className="tip-icon" />
          <div>
            <strong>{strings.tip}</strong> {cf.considerations}
          </div>
        </div>
      )}
      <div className="nav-spacer" />
      <div className={`nav${isFinal ? ' final' : ''}`}>
        <button className="back-btn" onClick={onBack}>{strings.back}</button>
        <button className="next-btn" onClick={onConfirm}>{buttonLabel}</button>
        <button className="skip-section-btn" onClick={onSkipSection}>{strings.skipSection}</button>
        {!isFinal && (
          <button className="skip-btn" onClick={onSkip}>{strings.skip}</button>
        )}
      </div>
      <InfoPopup
        show={showInfo}
        reasoning={auto?.reasoning || ''}
        onClose={() => setShowInfo(false)}
      />
    </div>
  );
}

export default FieldSubPage;
