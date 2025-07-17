import React from 'react';
import strings from '../../res/strings';

interface Props {
  goToBasicInfo: () => void;
  goToCompanyInfo: () => void;
  goToPostingGroups: () => void;
  goToPaymentTerms: () => void;
  goToGLSetup: () => void;
  goToSRSetup: () => void;
  goToCustomers: () => void;
  goToVendors: () => void;
  goToItems: () => void;
  back: () => void;
}

function ConfigMenuPage({
  goToBasicInfo,
  goToCompanyInfo,
  goToPostingGroups,
  goToPaymentTerms,
  goToGLSetup,
  goToSRSetup,
  goToCustomers,
  goToVendors,
  goToItems,
  back,
}: Props) {
  return (
    <div>
      <h2>{strings.selectConfigArea}</h2>
      <div className="menu-section">
        <h3>{strings.basicInfo}</h3>
        <div className="menu-grid">
          <div className="menu-box" onClick={goToBasicInfo}>
            <div className="icon" role="img" aria-label="Basic Info">ℹ️</div>
            <div>{strings.basicInfo}</div>
          </div>
        </div>
      </div>
      <div className="menu-section">
        <h3>{strings.configurationData}</h3>
        <div className="menu-grid">
          <div className="menu-box" onClick={goToCompanyInfo}>
            <div className="icon" role="img" aria-label="Company">🏢</div>
            <div>{strings.companyInfo}</div>
          </div>
          <div className="menu-box" onClick={goToPostingGroups}>
            <div className="icon" role="img" aria-label="Posting">📦</div>
            <div>Posting Information</div>
          </div>
          <div className="menu-box" onClick={goToPaymentTerms}>
            <div className="icon" role="img" aria-label="Payment Terms">💰</div>
            <div>{strings.paymentTerms}</div>
          </div>
          <div className="menu-box" onClick={goToGLSetup}>
            <div className="icon" role="img" aria-label="General Ledger Setup">📘</div>
            <div>{strings.generalLedgerSetup}</div>
          </div>
          <div className="menu-box" onClick={goToSRSetup}>
            <div className="icon" role="img" aria-label="Sales and Receivables">🛒</div>
            <div>{strings.salesReceivablesSetup}</div>
          </div>
        </div>
      </div>
      <div className="menu-section">
        <h3>{strings.masterData}</h3>
        <div className="menu-grid">
          <div className="menu-box" onClick={goToCustomers}>
            <div className="icon" role="img" aria-label="Customers">👤</div>
            <div>{strings.customers}</div>
          </div>
          <div className="menu-box" onClick={goToVendors}>
            <div className="icon" role="img" aria-label="Vendors">🏭</div>
            <div>{strings.vendors}</div>
          </div>
          <div className="menu-box" onClick={goToItems}>
            <div className="icon" role="img" aria-label="Items">📦</div>
            <div>{strings.items}</div>
          </div>
        </div>
      </div>
      <div className="nav">
        <button onClick={back}>{strings.back}</button>
      </div>
    </div>
  );
}

export default ConfigMenuPage;
