import React from 'react';
import strings from '../../res/strings';
import {
  InfoIcon,
  CompanyIcon,
  BookIcon,
  CartIcon,
  BoxIcon,
  UserIcon,
  FactoryIcon,
  CubeIcon,
  MoneyIcon,
  ArrowDownIcon,
} from '../components/Icons';

interface Props {
  goToBasicInfo: () => void;
  goToCompanyInfo: () => void;
  goToGLSetup: () => void;
  goToSRSetup: () => void;
  goToPPSetup: () => void;
  goToCustomers: () => void;
  goToVendors: () => void;
  goToItems: () => void;
  goToCurrencies: () => void;
  goToChartOfAccounts: () => void;
  goToCustomerTemplate: () => void;
  goToVendorTemplate: () => void;
  goToItemTemplate: () => void;
  goToGLAccountTemplate: () => void;
  goToBankAccountTemplate: () => void;
  goToFixedAssetTemplate: () => void;
  goToContactTemplate: () => void;
  goToEmployeeTemplate: () => void;
  goToResourceTemplate: () => void;
  back: () => void;
  basicDone: boolean;
  companyDone: boolean;
  companyInProgress: boolean;
  glDone: boolean;
  glInProgress: boolean;
  srDone: boolean;
  srInProgress: boolean;
  ppDone: boolean;
  ppInProgress: boolean;
  customersDone: boolean;
  vendorsDone: boolean;
  itemsDone: boolean;
  currenciesDone: boolean;
  chartAccountsDone: boolean;
}

function ConfigMenuPage({
  goToBasicInfo,
  goToCompanyInfo,
  goToGLSetup,
  goToSRSetup,
  goToPPSetup,
  goToCustomers,
  goToVendors,
  goToItems,
  goToCurrencies,
  goToChartOfAccounts,
  goToCustomerTemplate,
  goToVendorTemplate,
  goToItemTemplate,
  goToGLAccountTemplate,
  goToBankAccountTemplate,
  goToFixedAssetTemplate,
  goToContactTemplate,
  goToEmployeeTemplate,
  goToResourceTemplate,
  back,
  basicDone,
  companyDone,
  companyInProgress,
  glDone,
  glInProgress,
  srDone,
  srInProgress,
  ppDone,
  ppInProgress,
  customersDone,
  vendorsDone,
  itemsDone,
  currenciesDone,
  chartAccountsDone,
}: Props) {
  const nothingConfirmed =
    !basicDone &&
    !companyDone &&
    !glDone &&
    !srDone &&
    !customersDone &&
    !vendorsDone &&
    !itemsDone &&
    !currenciesDone &&
    !chartAccountsDone;
  return (
    <div>
      <div className="section-header">{strings.selectConfigArea}</div>
      <div className="menu-section">
        <h3>{strings.basicInfo}</h3>
        <div className="menu-grid">
          <div
            className="menu-box basic-info-box"
            onClick={goToBasicInfo}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') goToBasicInfo();
            }}
          >
            <InfoIcon />
            <div>{strings.basicInfoTitle}</div>
            {nothingConfirmed && (
              <div className="start-here-tip">
                <span>Start Here</span>
                <ArrowDownIcon />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="menu-section">
        <h3>{strings.configurationData}</h3>
        <div className="menu-grid">
          <div
            className={`menu-box ${companyDone ? 'done' : ''}`}
            onClick={goToCompanyInfo}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') goToCompanyInfo();
            }}
          >
            {companyDone && <div className="checkmark">✔</div>}
            {!companyDone && companyInProgress && (
              <div className="progress-dot">•</div>
            )}
            <CompanyIcon />
            <div>{strings.companyInfo}</div>
          </div>
          <div
            className={`menu-box ${glDone ? 'done' : ''}`}
            onClick={goToGLSetup}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') goToGLSetup();
            }}
          >
            {glDone && <div className="checkmark">✔</div>}
            {!glDone && glInProgress && (
              <div className="progress-dot">•</div>
            )}
            <BookIcon />
            <div>{strings.generalLedgerSetup}</div>
          </div>
          <div
            className={`menu-box ${srDone ? 'done' : ''}`}
            onClick={goToSRSetup}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') goToSRSetup();
            }}
          >
            {srDone && <div className="checkmark">✔</div>}
            {!srDone && srInProgress && (
              <div className="progress-dot">•</div>
            )}
            <CartIcon />
            <div>{strings.salesReceivablesSetup}</div>
          </div>
          <div
            className={`menu-box ${ppDone ? 'done' : ''}`}
            onClick={goToPPSetup}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') goToPPSetup();
            }}
          >
            {ppDone && <div className="checkmark">✔</div>}
            {!ppDone && ppInProgress && (
              <div className="progress-dot">•</div>
            )}
            <BoxIcon />
            <div>{strings.purchasePayablesSetup}</div>
          </div>
        </div>
      </div>
      <div className="menu-section">
        <h3>{strings.masterData}</h3>
        <div className="menu-grid">
          <div
            className={`menu-box ${customersDone ? 'done' : ''}`}
            onClick={goToCustomers}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') goToCustomers();
            }}
          >
            {customersDone && <div className="checkmark">✔</div>}
            <UserIcon />
            <div>{strings.customers}</div>
          </div>
          <div
            className={`menu-box ${vendorsDone ? 'done' : ''}`}
            onClick={goToVendors}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') goToVendors();
            }}
          >
            {vendorsDone && <div className="checkmark">✔</div>}
            <FactoryIcon />
            <div>{strings.vendors}</div>
          </div>
          <div
            className={`menu-box ${itemsDone ? 'done' : ''}`}
            onClick={goToItems}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') goToItems();
            }}
          >
            {itemsDone && <div className="checkmark">✔</div>}
            <CubeIcon />
            <div>{strings.items}</div>
          </div>
          <div
            className={`menu-box ${currenciesDone ? 'done' : ''}`}
            onClick={goToCurrencies}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') goToCurrencies();
            }}
          >
            {currenciesDone && <div className="checkmark">✔</div>}
            <MoneyIcon />
            <div>{strings.currencies}</div>
          </div>
          <div
            className={`menu-box ${chartAccountsDone ? 'done' : ''}`}
            onClick={goToChartOfAccounts}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') goToChartOfAccounts();
            }}
          >
            {chartAccountsDone && <div className="checkmark">✔</div>}
            <BookIcon />
            <div>{strings.chartOfAccounts}</div>
          </div>
        </div>
      </div>
      <div className="menu-section">
        <h3>{strings.configureTemplates}</h3>
        <div className="menu-grid">
          <div className="menu-box" onClick={goToCustomerTemplate} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goToCustomerTemplate(); }}>
            <UserIcon />
            <div>{strings.customerTemplate}</div>
          </div>
          <div className="menu-box" onClick={goToVendorTemplate} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goToVendorTemplate(); }}>
            <FactoryIcon />
            <div>{strings.vendorTemplate}</div>
          </div>
          <div className="menu-box" onClick={goToItemTemplate} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goToItemTemplate(); }}>
            <CubeIcon />
            <div>{strings.itemTemplate}</div>
          </div>
          <div className="menu-box" onClick={goToGLAccountTemplate} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goToGLAccountTemplate(); }}>
            <BookIcon />
            <div>{strings.glAccountTemplate}</div>
          </div>
          <div className="menu-box" onClick={goToBankAccountTemplate} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goToBankAccountTemplate(); }}>
            <MoneyIcon />
            <div>{strings.bankAccountTemplate}</div>
          </div>
          <div className="menu-box" onClick={goToFixedAssetTemplate} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goToFixedAssetTemplate(); }}>
            <BoxIcon />
            <div>{strings.fixedAssetTemplate}</div>
          </div>
          <div className="menu-box" onClick={goToContactTemplate} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goToContactTemplate(); }}>
            <UserIcon />
            <div>{strings.contactTemplate}</div>
          </div>
          <div className="menu-box" onClick={goToEmployeeTemplate} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goToEmployeeTemplate(); }}>
            <UserIcon />
            <div>{strings.employeeTemplate}</div>
          </div>
          <div className="menu-box" onClick={goToResourceTemplate} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goToResourceTemplate(); }}>
            <CubeIcon />
            <div>{strings.resourceTemplate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigMenuPage;
