import React, { useEffect, useState } from 'react';
import { CompanyField } from '../types';
import { fieldKey } from '../utils/helpers';
import { askOpenAI } from '../utils/ai';
import { InfoIcon, SparkleIcon } from '../components/Icons';
import InfoPopup from '../components/InfoPopup';

interface Props {
  title: string;
  fields: CompanyField[];
  formData: { [key: string]: any };
  hideUncommon: boolean;
  onUseDefaults: () => void;
  onReview: () => void;
  onSkip: () => void;
}

export default function OptionalSetupPage({
  title,
  fields,
  formData,
  hideUncommon,
  onUseDefaults,
  onReview,
  onSkip,
}: Props) {
  const visibleFields = hideUncommon
    ? fields.filter(f => f.common === 'common')
    : fields;
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiReason, setAiReason] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    async function fetchAI() {
      try {
        const defaults: Record<string, any> = {};
        visibleFields.forEach(f => {
          defaults[f.field] = formData[fieldKey(f.field)];
        });
        const prompt =
          `You are assisting with configuring Dynamics 365 Business Central. ` +
          `The company's industry is "${formData.industry}" and that should be heavily considered. ` +
          `Here is all of the information we know about the company as JSON:\n` +
          JSON.stringify(formData, null, 2) +
          `\nHere are the default values for the section "${title}":\n` +
          JSON.stringify(defaults, null, 2) +
          `\nIs it necessary that the customer change these defaults? ` +
          `Respond only in JSON like {"answer":"Yes"|"No","reason":"<200 characters>"}.`;
        const ans = await askOpenAI(prompt);
        const cleaned = ans.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        setAiAnswer(parsed.answer || '');
        setAiReason(parsed.reason || '');
      } catch (e) {
        console.error(e);
      }
    }
    fetchAI();
  }, [fields, formData, hideUncommon]);
  return (
    <div>
      <div className="section-header">{title}</div>
      <div className="question">
        <div className="question-main">
          {`Configuring data for "${title}" is optional. Below is the preconfigured data. Would like to use the defaults or go through and review all the choices?`}
        </div>
      </div>
      <table className="defaults-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {visibleFields.map(f => {
            const val = formData[fieldKey(f.field)];
            const displayValue =
              f.fieldType === 'Boolean'
                ? val === '1' || val === 1 || val === true
                  ? 'True'
                  : val === '0' || val === 0 || val === false
                  ? 'False'
                  : ''
                : String(val ?? '');
            return (
              <tr key={f.field}>
                <td>{f.question}</td>
                <td>{f.field}</td>
                <td>{displayValue}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="divider" />
      <div className="nav">
        <button className="next-btn" onClick={onUseDefaults}>Use the defaults</button>
        <div className="review-area">
          <button className="next-btn" onClick={onReview}>Review all the choices</button>
          {aiAnswer.trim().toLowerCase() === 'yes' && (
            <span className="ai-review-hint" onClick={() => setShowInfo(true)}>
              AI recommends to review the choices
              <InfoIcon className="info-icon" />
            </span>
          )}
        </div>
        <button className="skip-btn skip-right" onClick={onSkip}>Decide later</button>
        {aiAnswer.trim().toLowerCase() === 'no' && (
          <span className="ai-skip-hint">
            <SparkleIcon className="sparkle-icon" />
            AI recommends 'Skip It' -- The defaults are fine
            <InfoIcon
              className="info-icon"
              title={aiReason}
              onClick={() => setShowInfo(true)}
            />
          </span>
        )}
      </div>
      <InfoPopup show={showInfo} reasoning={aiReason} onClose={() => setShowInfo(false)} />
    </div>
  );
}
