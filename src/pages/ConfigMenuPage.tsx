import React from 'react';
import strings from '../../res/strings';

interface Props {
  goToBasicInfo: () => void;
  goToCompanyInfo: () => void;
  goToGLSetup: () => void;
  goToSRSetup: () => void;
  goToCustomers: () => void;
  goToVendors: () => void;
  goToItems: () => void;
  back: () => void;
  companyDone: boolean;
  glDone: boolean;
  srDone: boolean;
}

function ConfigMenuPage({
  goToBasicInfo,
  goToCompanyInfo,
  goToGLSetup,
  goToSRSetup,
  goToCustomers,
  goToVendors,
  goToItems,
  back,
  companyDone,
  glDone,
  srDone,
}: Props) {
  return (
    <div>
      <h2>{strings.selectConfigArea}</h2>
      <div className="menu-section">
        <h3>{strings.basicInfo}</h3>
        <div className="menu-grid">
          <div className="menu-box" onClick={goToBasicInfo}>
            <div className="icon" role="img" aria-label="Basic Info">ℹ️</div>
            <div>{strings.basicInfoTitle}</div>
          </div>
        </div>
      </div>
      <div className="menu-section">
        <h3>{strings.configurationData}</h3>
        <div className="menu-grid">
          <div className={`menu-box ${companyDone ? 'done' : ''}`} onClick={goToCompanyInfo}>
            {companyDone && <div className="checkmark">✔</div>}
            <div className="icon" role="img" aria-label="Company">🏢</div>
            <div>{strings.companyInfo}</div>
          </div>
          <div className={`menu-box ${glDone ? 'done' : ''}`} onClick={goToGLSetup}>
            {glDone && <div className="checkmark">✔</div>}
            <div className="icon" role="img" aria-label="General Ledger Setup">📘</div>
            <div>{strings.generalLedgerSetup}</div>
          </div>
          <div className={`menu-box ${srDone ? 'done' : ''}`} onClick={goToSRSetup}>
            {srDone && <div className="checkmark">✔</div>}
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
    </div>
  );
}

export default ConfigMenuPage;
