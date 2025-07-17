import React from 'react';
import strings from '../../res/strings';
import {
  InfoIcon,
  CompanyIcon,
  BoxIcon,
  MoneyIcon,
  BookIcon,
  CartIcon,
  UserIcon,
  FactoryIcon,
  CubeIcon,
} from '../components/Icons';

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
  companyDone: boolean;
  glDone: boolean;
  srDone: boolean;
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
            <InfoIcon />
            <div>{strings.basicInfoTitle}</div>
          </div>
        </div>
      </div>
      <div className="menu-section">
        <h3>{strings.configurationData}</h3>
        <div className="menu-grid">
          <div className={`menu-box ${companyDone ? 'done' : ''}`} onClick={goToCompanyInfo}>
            {companyDone && <div className="checkmark">✔</div>}
            <CompanyIcon />
            <div>{strings.companyInfo}</div>
          </div>
          <div className="menu-box" onClick={goToPostingGroups}>
            <BoxIcon />
            <div>Posting Information</div>
          </div>
          <div className="menu-box" onClick={goToPaymentTerms}>
            <MoneyIcon />
            <div>{strings.paymentTerms}</div>
          </div>
          <div className={`menu-box ${glDone ? 'done' : ''}`} onClick={goToGLSetup}>
            {glDone && <div className="checkmark">✔</div>}
            <BookIcon />
            <div>{strings.generalLedgerSetup}</div>
          </div>
          <div className={`menu-box ${srDone ? 'done' : ''}`} onClick={goToSRSetup}>
            {srDone && <div className="checkmark">✔</div>}
            <CartIcon />
            <div>{strings.salesReceivablesSetup}</div>
          </div>
        </div>
      </div>
      <div className="menu-section">
        <h3>{strings.masterData}</h3>
        <div className="menu-grid">
          <div className="menu-box" onClick={goToCustomers}>
            <UserIcon />
            <div>{strings.customers}</div>
          </div>
          <div className="menu-box" onClick={goToVendors}>
            <FactoryIcon />
            <div>{strings.vendors}</div>
          </div>
          <div className="menu-box" onClick={goToItems}>
            <CubeIcon />
            <div>{strings.items}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigMenuPage;
