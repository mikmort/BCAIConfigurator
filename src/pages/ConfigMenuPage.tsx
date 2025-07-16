import React from 'react';

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
      <h2>Select a configuration area</h2>
      <div className="menu-grid">
        <div className="menu-box" onClick={goToCompanyInfo}>
          <div className="icon" role="img" aria-label="Company">
            🏢
          </div>
          <div>Company Information</div>
        </div>
        <div className="menu-box" onClick={goToPostingGroups}>
          <div className="icon" role="img" aria-label="Posting Groups">
            📦
          </div>
          <div>Posting Groups</div>
        </div>
        <div className="menu-box" onClick={goToPaymentTerms}>
          <div className="icon" role="img" aria-label="Payment Terms">
            💰
          </div>
          <div>Payment Terms</div>
        </div>
      </div>
      <div className="nav">
        <button onClick={back}>Back</button>
      </div>
    </div>
  );
}

export default ConfigMenuPage;
