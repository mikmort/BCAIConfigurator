import React from 'react';
import strings from '../../res/strings';

interface Props {
  goToCompanyInfo: () => void;
  goToPostingGroups: () => void;
  goToPaymentTerms: () => void;
  back: () => void;
}

function ConfigMenuPage({
  goToCompanyInfo,
  goToPostingGroups,
  goToPaymentTerms,
  back,
}: Props) {
  return (
    <div>
      <h2>{strings.selectConfigArea}</h2>
      <div className="menu-grid">
        <div className="menu-box" onClick={goToCompanyInfo}>
          <div className="icon" role="img" aria-label="Company">
            🏢
          </div>
          <div>{strings.companyInfo}</div>
        </div>
        <div className="menu-box" onClick={goToPostingGroups}>
          <div className="icon" role="img" aria-label="Posting Groups">
            📦
          </div>
          <div>{strings.postingGroups}</div>
        </div>
        <div className="menu-box" onClick={goToPaymentTerms}>
          <div className="icon" role="img" aria-label="Payment Terms">
            💰
          </div>
          <div>{strings.paymentTerms}</div>
        </div>
      </div>
      <div className="nav">
        <button onClick={back}>{strings.back}</button>
      </div>
    </div>
  );
}

export default ConfigMenuPage;
