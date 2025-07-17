import React from 'react';
import ReactDOM from 'react-dom/client';

// Simple React app to guide users through Business Central setup
const { useState, useEffect } = React;
import HomePage from './pages/HomePage';
import ConfigMenuPage from './pages/ConfigMenuPage';
import BasicInfoPage from './pages/BasicInfoPage';
import CompanyInfoPage from './pages/CompanyInfoPage';
import PostingGroupsPage from './pages/PostingGroupsPage';
import PaymentTermsPage from './pages/PaymentTermsPage';
import FinishPage from './pages/FinishPage';
import GLSetupPage from './pages/GLSetupPage';
import SalesReceivablesPage from './pages/SalesReceivablesPage';
import CustomersPage from './pages/CustomersPage';
import VendorsPage from './pages/VendorsPage';
import ItemsPage from './pages/ItemsPage';
import ReviewPage from './pages/ReviewPage';
import BCLogo from './images/Examples/BC Logo.png';
import copilotIcon from './images/copilot.svg';
import strings from '../res/strings';
import { CompanyField, BasicInfo } from './types';
import {
  fieldKey,
  findFieldValue,
  mapFieldName,
  findTableRows,
  extractFieldValues,
} from './utils/helpers';
import { parseQuestions, recommendedCode } from './utils/jsonParsing';
import { loadStartingData, loadConfigTables } from './utils/dataLoader';

const companyFieldNames = [
  'Company Name',
  'Address',
  'City',
  'State',
  'ZIP Code',
  'Phone No.',
  'Email',
  'Country/Region Code',
  'Tax Registration No.',
  'Fed. Tax ID (if available)',
  'Company Website',
  'Base Calendar Code',
  'Invoice Address Code',
  'Logo (Picture)',
];

const glFieldNames = [
  'Allow Posting From',
  'Allow Posting To',
  'Register Time',
  'Allow Deferral Posting From',
  'Allow Deferral Posting To',
  'Local Currency (LCY) Code',
  'EMU Currency',
  'Additional Reporting Currency',
  'Amount Decimal Places',
  'Unit-Amount Decimal Places',
  'Amount Rounding Precision',
  'Invoice Rounding Precision (LCY)',
  'Invoice Rounding Type (LCY)',
  'Summarize G/L Entries',
  'Mark Cr. Memos as Corrections',
  'Allow G/L Acc. Deletion Before',
  'Block Deletion of G/L Accounts',
  'Acc. Sched. for Retained Earn.',
  'Fin. Rep. for Retained Earn.',
  'Global Dimension 1 Code',
  'Global Dimension 2 Code',
  'Shortcut Dimension 3 Code',
  'Shortcut Dimension 4 Code',
  'Shortcut Dimension 5 Code',
  'Shortcut Dimension 6 Code',
  'Shortcut Dimension 7 Code',
  'Shortcut Dimension 8 Code',
  'Unrealized VAT',
  'VAT Tolerance %',
  'Max. VAT Difference Allowed',
  'VAT Calculation Type',
];


const srFieldNames = [
  'Email Logging Enabled',
  'Exchange Client Id',
  'Exchange Client Secret Key',
  'Discount Posting',
  'Credit Warnings',
  'Stockout Warning',
  'Shipment on Invoice',
  'Invoice Rounding',
  'Ext. Doc. No. Mandatory',
  'Default Posting Date',
  'Default Quantity to Ship',
  'Customer Nos.',
  'Quote Nos.',
  'Order Nos.',
  'Invoice Nos.',
  'Posted Invoice Nos.',
  'Credit Memo Nos.',
  'Posted Credit Memo Nos.',
  'Posted Shipment Nos.',
  'Blanket Order Nos.',
  'Return Order Nos.',
  'Posted Return Receipt Nos.',
  'Calc. Inv. Discount',
  'Receipt on Invoice',
  'Ext. Doc. No. Mandatory (Purchases)',
  'Vendor Nos.',
  'Quote Nos. (Purchases)',
  'Order Nos. (Purchases)',
  'Invoice Nos. (Purchases)',
  'Posted Invoice Nos. (Purchases)',
  'Credit Memo Nos. (Purchases)',
  'Posted Credit Memo Nos. (Purchases)',
  'Posted Receipt Nos.',
  'Blanket Order Nos. (Purchases)',
  'Return Order Nos. (Purchases)',
  'Posted Return Shpt. Nos.',
  'Posted Prepayment Inv. Nos.',
  'Posted Prepayment Cr. Memo Nos.',
  'Receipt Nos.',
  'Put-away Nos.',
  'Pick Nos.',
  'Movement Nos.',
  'Registered Put-away Nos.',
  'Registered Pick Nos.',
  'Registered Movement Nos.',
  'Simulated Order Nos.',
  'Planned Order Nos.',
  'Firm Planned Order Nos.',
  'Released Order Nos.',
  'Work Center Nos.',
  'Machine Center Nos.',
  'Production BOM Nos.',
  'Routing Nos.',
  'FA Nos.',
  'Depreciation Book Nos.',
  'FA Journal Batch Name',
  'Copy Comments Blanket Order to Order',
  'Copy Comments Order to Invoice',
  'Copy Comments Order to Shipment',
  'Archive Quotes',
  'Archive Orders',
  'Archive Return Orders',
  'Allow VAT Difference',
];

function makeFields(names: string[]): CompanyField[] {
  return names.map(n => ({
    field: n,
    recommended: '',
    considerations: '',
    common: 'unlikely',
  }));
}

interface FormData {
  [key: string]: any;
}


function App() {
  const [step, setStep] = useState(0 as number);
  const [rapidStart, setRapidStart] = useState('' as string);
  const [formData, setFormData] = useState({} as FormData);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    companyName: '',
    industry: '',
    websiteUrl: '',
    description: '',
  });
  const [companyFields, setCompanyFields] = useState([] as CompanyField[]);
  const [glFields, setGlFields] = useState([] as CompanyField[]);
  const [srFields, setSrFields] = useState([] as CompanyField[]);
  const [companyProgress, setCompanyProgress] = useState<boolean[]>([]);
  const [glProgress, setGlProgress] = useState<boolean[]>([]);
  const [srProgress, setSrProgress] = useState<boolean[]>([]);
  const [companyVisited, setCompanyVisited] = useState<boolean[]>([]);
  const [glVisited, setGlVisited] = useState<boolean[]>([]);
  const [srVisited, setSrVisited] = useState<boolean[]>([]);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [debugMessages, setDebugMessages] = useState([] as string[]);
  const [countries, setCountries] = useState([] as { code: string; name: string }[]);
  const [currencies, setCurrencies] = useState([] as { code: string; description: string }[]);
  const [paymentTermsOptions, setPaymentTermsOptions] = useState([] as { code: string; description: string }[]);
  const [startData, setStartData] = useState<any>(null);
  const [baseCalendarOptions, setBaseCalendarOptions] = useState(['STANDARD']);
  const [showAI, setShowAI] = useState(false);
  const [aiSuggested, setAiSuggested] = useState('');
  const [aiExtra, setAiExtra] = useState('');
  const [aiFieldKey, setAiFieldKey] = useState('');
  const [aiPromptBase, setAiPromptBase] = useState('');
  const [configOpen, setConfigOpen] = useState(true);
  const [masterOpen, setMasterOpen] = useState(false);
  const [basicDone, setBasicDone] = useState(false);
  const [postingDone, setPostingDone] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [customersDone, setCustomersDone] = useState(false);
  const [vendorsDone, setVendorsDone] = useState(false);
  const [itemsDone, setItemsDone] = useState(false);
  const [aiParsed, setAiParsed] = useState({
    suggested: '',
    confidence: '',
    reasoning: '',
  });

  const suggestionFields = new Set(['Country/Region Code', 'Base Calendar Code']);

  function logDebug(msg: string): void {
    setDebugMessages((m: string[]) => [...m, msg]);
    console.log(msg);
  }

  useEffect(() => {
    async function init() {
      try {
        logDebug('Loading starting data');
        const data = await loadStartingData();
        logDebug('Starting data loaded');
        setRapidStart(JSON.stringify(data));
        setStartData(data);

        const countries =
          data?.DataList?.CountryRegionList?.CountryRegion?.map((c: any) => ({
            code: c.Code?.['#text'] || '',
            name: c.Name?.['#text'] || '',
          })) || [];
        setCountries(countries);

        const currencies =
          data?.DataList?.CurrencyList?.Currency?.map((c: any) => ({
            code: c.Code?.['#text'] || '',
            description: c.Description?.['#text'] || '',
          })) || [];
        setCurrencies(currencies);

        const paymentTermsList =
          data?.DataList?.PaymentTermsList?.PaymentTerms?.map((p: any) => ({
            code: p.Code?.['#text'] || '',
            description: p.Description?.['#text'] || '',
          })) || [];
        setPaymentTermsOptions(paymentTermsList);

        const termsKey = Object.keys(data.DataList || {}).find(k =>
          k.toLowerCase().includes('paymentterms')
        );
        if (termsKey) {
          const val = (data.DataList as any)[termsKey]?.PaymentTerms;
          if (Array.isArray(val) && val[0]) {
            const pt = val[0];
            const code = pt.Code?.['#text'] || '';
            setFormData((f: FormData) => ({ ...f, paymentTerms: code }));
          }
        }
      } catch (e) {
        console.error('Failed to load starting data', e);
        logDebug(`Failed to load starting data: ${e}`);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!aiSuggested) {
      setAiParsed({ suggested: '', confidence: '', reasoning: '' });
      return;
    }
    try {
      const cleaned = aiSuggested.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      const suggested =
        parsed['Suggested Value'] ||
        parsed.suggested ||
        parsed.value ||
        parsed.result ||
        parsed.val ||
        (typeof parsed === 'object' ? parsed[Object.keys(parsed)[0]] : '');
      setAiParsed({
        suggested: suggested || '',
        confidence: parsed['Confidence'] || parsed.confidence || '',
        reasoning: parsed['Reasoning'] || parsed.reasoning || '',
      });
    } catch (e) {
      logDebug(`Failed to parse JSON suggestion: ${e}`);
      setAiParsed({ suggested: aiSuggested, confidence: '', reasoning: '' });
    }
  }, [aiSuggested]);

  useEffect(() => {
    if (!startData) return;
    const all = [...companyFields, ...glFields, ...srFields];
    setFormData(f => {
      const copy: FormData = { ...f };
      all.forEach(cf => {
        const key = fieldKey(cf.field);
        if (copy[key]) return;
        const internal = mapFieldName(cf.field);
        const val = findFieldValue(startData, internal);
        if (val !== undefined) {
          copy[key] = val;
        }
      });
      return copy;
    });
  }, [startData, companyFields, glFields, srFields]);

  useEffect(() => {
    const nameKey = fieldKey('Company Name');
    const siteKey = fieldKey('Company Website');
    setFormData(f => ({
      ...f,
      [nameKey]: basicInfo.companyName || f[nameKey] || '',
      [siteKey]: basicInfo.websiteUrl || f[siteKey] || '',
    }));
  }, [basicInfo]);

  useEffect(() => {
    async function init() {
      try {
        logDebug('Loading config tables');
        const data = await loadConfigTables();
        const company = parseQuestions(data, companyFieldNames);
        setCompanyFields(company);
        setCompanyProgress(company.filter(f => f.common === 'common').map(() => false));
        setCompanyVisited(company.filter(f => f.common === 'common').map(() => false));
        setFormData((f: FormData) => {
          const copy: FormData = { ...f };
          company.forEach(cf => {
            const key = fieldKey(cf.field);
            if (!(key in copy)) copy[key] = '';
          });
          return copy;
        });

        const gl = parseQuestions(data, glFieldNames);
        setGlFields(gl);
        setGlProgress(gl.filter(f => f.common === 'common').map(() => false));
        setGlVisited(gl.filter(f => f.common === 'common').map(() => false));
        setFormData((f: FormData) => {
          const copy: FormData = { ...f };
          gl.forEach(cf => {
            const key = fieldKey(cf.field);
            if (!(key in copy)) copy[key] = '';
          });
          return copy;
        });

        const sr = parseQuestions(data, srFieldNames);
        setSrFields(sr);
        setSrProgress(sr.filter(f => f.common === 'common').map(() => false));
        setSrVisited(sr.filter(f => f.common === 'common').map(() => false));
        setFormData((f: FormData) => {
          const copy: FormData = { ...f };
          sr.forEach(cf => {
            const key = fieldKey(cf.field);
            if (!(key in copy)) copy[key] = '';
          });
          return copy;
        });
      } catch (e) {
        console.error('Failed to load config tables', e);
        logDebug(`Failed to load config tables: ${e}`);
      }
    }
    init();
  }, []);

  function handleChange(e: any) {
    const { name, type, value, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files && files[0] ? files[0] : null });
      return;
    }
    setFormData({ ...formData, [name]: value });
    if (name in basicInfo) {
      setBasicInfo({ ...basicInfo, [name as keyof BasicInfo]: value });
    }
  }

  function handleBlur(e: any): void {
    if (!e.target.checkValidity()) {
      alert('Invalid value');
    }
    const { name, value } = e.target;
    if (name === 'paymentTerms') {
      if (value && !paymentTermsOptions.find(o => o.code === value)) {
        setPaymentTermsOptions([...paymentTermsOptions, { code: value, description: value }]);
      }
    } else if (name === fieldKey('Base Calendar Code')) {
      if (value && !baseCalendarOptions.includes(value)) {
        setBaseCalendarOptions([...baseCalendarOptions, value]);
      }
    } else if (name === fieldKey('Country/Region Code')) {
      if (value && !countries.find(c => c.code === value)) {
        setCountries([...countries, { code: value, name: value }]);
      }
    } else if (name === fieldKey('Local Currency (LCY) Code')) {
      if (value && !currencies.find(c => c.code === value)) {
        setCurrencies([...currencies, { code: value, description: value }]);
      }
    }
  }

  function next(): void {
    if (step === 2) setBasicDone(true);
    if (step === 4) setPostingDone(true);
    if (step === 5) setPaymentDone(true);
    if (step === 8) setCustomersDone(true);
    if (step === 9) setVendorsDone(true);
    if (step === 10) setItemsDone(true);
    setStep(step + 1);
  }

  function back(): void {
    setStep(step - 1);
  }

  function goHome(): void {
    setStep(1);
  }

  function openAIDialog(
    fieldName: string,
    key: string,
    currentValue: string,
    considerations: string = ''
  ): void {
    let prompt =
      'We are configuring Dynamics Business Central\n\n' +
      'We are looking for a recommended value for the field:\n\n' +
      `${fieldName}\n\n` +
      `The current value is: ${currentValue || '(blank)'}\n\n` +
      'Please us the following information to help determine the recommended value\n--------------\n';

    const parts: string[] = [];

    const addConfirmed = (fields: CompanyField[], progress: boolean[]) => {
      const common = fields.filter(f => f.common === 'common');
      common.forEach((cf, idx) => {
        if (progress[idx]) {
          const val = formData[fieldKey(cf.field)];
          if (val) parts.push(`${cf.field}: ${val}`);
        }
      });
    };

    addConfirmed(companyFields, companyProgress);
    addConfirmed(glFields, glProgress);
    addConfirmed(srFields, srProgress);

    if (parts.length) {
      prompt += parts.join('\n') + '\n';
    }

    if (considerations) {
      prompt += `${fieldName} considerations: ${considerations}\n`;
    }

    prompt +=
      '---------------\nPlease return the response strictly as JSON with the properties "Suggested Value", "Confidence", and "Reasoning". ' +
      'Confidence should indicate how certain you are that this is the final value the user will want for this field in Dynamics Business Central. ' +
      'Confidence must be one of "Very High", "High", "Medium", "Low", or "Very Low".';
    setAiPromptBase(prompt);
    setAiExtra('');
    setAiFieldKey(key);
    setAiSuggested('');
    setShowAI(true);
    askOpenAI(prompt).then(ans => setAiSuggested(ans));
  }

  function closeAIDialog(): void {
    setShowAI(false);
  }

  function askAgain(): void {
    const prompt = `${aiPromptBase} Additional Instructions: ${aiExtra}`;
    setAiSuggested('');
    askOpenAI(prompt).then(ans => setAiSuggested(ans));
  }

  function acceptSuggested() {
    try {
      const val = aiParsed.suggested;
      setFormData(f => ({ ...f, [aiFieldKey]: val }));
    } catch (e) {
      console.error(e);
      logDebug(`Failed to accept suggestion: ${e}`);
    } finally {
      closeAIDialog();
    }
  }

  async function askOpenAI(prompt: string) {
    try {
      logDebug(`Asking OpenAI: ${prompt}`);
      const cfg = (window as any).azureOpenAIConfig || {};
      if (!cfg.endpoint || !cfg.apiKey || !cfg.deployment) {
        throw new Error('Azure OpenAI not configured');
      }
      const url = `${cfg.endpoint}/openai/deployments/${cfg.deployment}/chat/completions?api-version=2024-02-15-preview`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': cfg.apiKey,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      });
      const data = await resp.json();
      const answer = data.choices?.[0]?.message?.content || '';
      logDebug('OpenAI answered');
      return answer;
    } catch (e) {
      console.error(e);
      logDebug(`OpenAI call failed: ${e}`);
      throw e;
    }
  }

  function applyRecommendedValue(cf: CompanyField) {
    const key = fieldKey(cf.field);
    setFormData(f => ({ ...f, [key]: recommendedCode(cf.recommended) }));
  }

  function handleRecommended(cf: CompanyField) {
    if (cf.recommended) {
      const rec = recommendedCode(cf.recommended);
      if (window.confirm(`Suggested value: ${rec}. Use it?`)) {
        applyRecommendedValue(cf);
      }
    }
  }

  async function generateCustomRapidStart(): Promise<void> {
    logDebug('Preparing RapidStart XML');
    const xml = `<?xml version="1.0"?>\n<CustomRapidStart>\n  <CompanyName>${formData.companyName}</CompanyName>\n  <Address>${formData.address}</Address>\n  <Country>${formData.country}</Country>\n  <PostingGroup>${formData.postingGroup}</PostingGroup>\n  <PaymentTerms>${formData.paymentTerms}</PaymentTerms>\n</CustomRapidStart>`;

    const fileName = `${(formData.companyName || 'CustomRapidStart')
      .replace(/\s+/g, '_')}.rapidstart`;

    try {
      const cfg = (window as any).azureStorageConfig || {};
      if (!cfg.connectionString) {
        throw new Error('Azure connection string not configured');
      }
      logDebug('Connecting to Azure Blob Storage');
      const az = (window as any).azblob;
      if (!az) {
        throw new Error('Azure Storage library not loaded');
      }
      const blobServiceClient = az.BlobServiceClient.fromConnectionString(
        cfg.connectionString
      );
      const containerClient = blobServiceClient.getContainerClient(cfg.containerName || 'bctemplates');
      logDebug(`Using container: ${containerClient.containerName}`);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      logDebug(`Uploading ${fileName}`);
      await blockBlobClient.upload(xml, xml.length);
      logDebug('Upload succeeded');
      setDownloadUrl(blockBlobClient.url);
      logDebug(`File URL: ${blockBlobClient.url}`);
    } catch (e) {
      console.error('Upload failed', e);
      logDebug(`Upload failed: ${e}`);
    }
  }

  function renderInput(cf: CompanyField) {
    const key = fieldKey(cf.field);
    const val = formData[key] || '';
    let inputProps: any = {
      name: key,
      value: val,
      onChange: handleChange,
      onBlur: handleBlur,
    };
    if (cf.fieldType === 'Boolean') {
      return (
        <>
          <label><input type="radio" name={key} value="1" checked={val === '1'} onChange={handleChange}/> Yes</label>
          <label><input type="radio" name={key} value="0" checked={val === '0'} onChange={handleChange}/> No</label>
          <label><input type="radio" name={key} value="" checked={val === ''} onChange={handleChange}/> I'm not sure</label>
        </>
      );
    }
    if (/phone/i.test(cf.field)) {
      inputProps.type = 'tel';
      inputProps.pattern = '[0-9+()\- ]+';
    } else if (cf.fieldType === 'Date' || /date/i.test(cf.field)) {
      inputProps.type = 'date';
    } else if (/number|amount|qty|quantity/i.test(cf.field)) {
      inputProps.type = 'number';
    }

    let inputEl: any = <input {...inputProps} />;
    if (/address|description|notes|comment/i.test(cf.field)) {
      inputEl = (
        <textarea
          {...inputProps}
          rows={4}
        />
      );
    }
    if (cf.field === 'Logo (Picture)') {
      inputEl = <input type="file" name={key} onChange={handleChange} />;
    } else if (cf.field === 'Base Calendar Code') {
      inputEl = (
        <>
          <input
            list="base-calendar-list"
            name={key}
            value={val}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <datalist id="base-calendar-list">
            <option value="" />
            {baseCalendarOptions.map(o => (
              <option key={o} value={o} />
            ))}
          </datalist>
        </>
      );
    } else if (cf.field === 'Country/Region Code') {
      inputEl = (
        <>
          <input
            list="country-list"
            name={key}
            value={val}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <datalist id="country-list">
            <option value="" />
            {countries.map((c: { code: string; name: string }) => (
              <option key={c.code} value={c.code}>
                {c.name || c.code}
              </option>
            ))}
          </datalist>
        </>
      );
    } else if (cf.field === 'Local Currency (LCY) Code') {
      inputEl = <input {...inputProps} />;
    } else if (cf.lookupTable && startData) {
      const rows = findTableRows(startData, cf.lookupTable) || [];
      const opts = extractFieldValues(rows, cf.lookupField || 'Code');
      inputEl = (
        <select {...inputProps}>
          <option value="" />
          {opts.map(o => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    }

    return (
      <>
        {inputEl}
        {/* recommended icon moved to FieldSubPage */}
        <button
          type="button"
          className="ai-btn"
          title="Ask AI"
          onClick={() => openAIDialog(cf.field, key, val, cf.considerations)}
        >
          <img src={copilotIcon} alt="" className="copilot-icon" />
          Ask AI to help
        </button>
      </>
    );
  }

  function renderField(cf: CompanyField) {
    const key = fieldKey(cf.field);
    return (
      <div className="field-row" key={key}>
        <div className="field-name">{cf.field}</div>
        <div className="field-input">{renderInput(cf)}</div>
        <div className="field-considerations">{cf.considerations}</div>
      </div>
    );
  }

  const companyDone = companyProgress.length > 0 && companyProgress.every(Boolean);
  const glDone = glProgress.length > 0 && glProgress.every(Boolean);
  const srDone = srProgress.length > 0 && srProgress.every(Boolean);
  const configSectionDone =
    companyDone && postingDone && paymentDone && glDone && srDone;
  const basicSectionDone = basicDone;
  const masterSectionDone = customersDone && vendorsDone && itemsDone;
  const currentGroup = (() => {
    if (step === 2) return 'basic';
    if ([3, 4, 5, 6, 7].includes(step)) return 'config';
    if ([8, 9, 10].includes(step)) return 'master';
    if (step === 12) return 'review';
    return '';
  })();

  const progressPercent = (() => {
    switch (currentGroup) {
      case 'basic':
        return 25;
      case 'config':
        return 50;
      case 'master':
        return 75;
      case 'review':
        return 100;
      default:
        return 0;
    }
  })();

  if (step === 0) {
    return (
      <div className="app">
        <HomePage next={next} />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="home-link" onClick={() => setStep(1)}>Home</div>
            <img src={BCLogo} alt="BC" className="logo" />
            <h2>Setup Business Central</h2>
          </div>
          <nav>
            <div className="group">
              <div className="group-title">
                {strings.basicInfo} {basicSectionDone && <span className="check">✔</span>}
              </div>
              <ul>
                <li onClick={() => setStep(2)}>
                  {basicDone && <span className="check">✔</span>}
                  {strings.basicInfo}
                </li>
              </ul>
            </div>
            <div className="group">
              <div
                className="group-title"
                onClick={() => setConfigOpen(!configOpen)}
              >
                <span className="toggle">{configOpen ? '-' : '+'}</span>
                {strings.configurationData}{' '}
                {configSectionDone && <span className="check">✔</span>}
              </div>
              {configOpen && (
                <ul>
                  <li onClick={() => setStep(3)}>
                    {companyDone && <span className="check">✔</span>}
                    {strings.companyInfo}
                  </li>
                  {step === 3 && (
                    <ul className="subnav">
                      {companyFields
                        .filter(f => f.common === 'common')
                        .map((f, i) => (
                          <li key={f.field}>
                            {companyProgress[i] && <span className="check">✔</span>}
                            {f.field}
                          </li>
                        ))}
                    </ul>
                  )}
                  <li onClick={() => setStep(4)}>
                    {postingDone && <span className="check">✔</span>}
                    Posting Information
                  </li>
                  <li onClick={() => setStep(5)}>
                    {paymentDone && <span className="check">✔</span>}
                    {strings.paymentTerms}
                  </li>
                  <li onClick={() => setStep(6)}>
                    {glDone && <span className="check">✔</span>}
                    {strings.generalLedgerSetup}
                  </li>
                  {step === 6 && (
                    <ul className="subnav">
                      {glFields
                        .filter(f => f.common === 'common')
                        .map((f, i) => (
                          <li key={f.field}>
                            {glProgress[i] && <span className="check">✔</span>}
                            {f.field}
                          </li>
                        ))}
                    </ul>
                  )}
                  <li onClick={() => setStep(7)}>
                    {srDone && <span className="check">✔</span>}
                    {strings.salesReceivablesSetup}
                  </li>
                  {step === 7 && (
                    <ul className="subnav">
                      {srFields
                        .filter(f => f.common === 'common')
                        .map((f, i) => (
                          <li key={f.field}>
                            {srProgress[i] && <span className="check">✔</span>}
                            {f.field}
                          </li>
                        ))}
                    </ul>
                  )}
                </ul>
              )}
            </div>
            <div className="group">
              <div
                className="group-title"
                onClick={() => setMasterOpen(!masterOpen)}
              >
                <span className="toggle">{masterOpen ? '-' : '+'}</span>
                {strings.masterData}{' '}
                {masterSectionDone && <span className="check">✔</span>}
              </div>
              {masterOpen && (
                <ul>
                  <li onClick={() => setStep(8)}>
                    {customersDone && <span className="check">✔</span>}
                    {strings.customers}
                  </li>
                  <li onClick={() => setStep(9)}>
                    {vendorsDone && <span className="check">✔</span>}
                    {strings.vendors}
                  </li>
                  <li onClick={() => setStep(10)}>
                    {itemsDone && <span className="check">✔</span>}
                    {strings.items}
                  </li>
                </ul>
              )}
          </div>
          </nav>
        </aside>
        <div className="content">
          <div className="topbar">
            <div className="actions">
              <span>{strings.search}</span>
              <button className="help-btn">
                <span className="icon">?</span>
                {strings.help}
              </button>
            </div>
            <div className="progress-area">
              <div className="progress-slider">
                <div className={`progress-step ${currentGroup === 'basic' ? 'active' : ''}`}>
                  <div className="circle">1</div>
                  <span>{strings.basicInfoTitle}</span>
                </div>
                <div className={`progress-step ${currentGroup === 'config' ? 'active' : ''}`}> 
                  <div className="circle">2</div>
                  <span>{strings.configurationData}</span>
                </div>
                <div className={`progress-step ${currentGroup === 'master' ? 'active' : ''}`}> 
                  <div className="circle">3</div>
                  <span>{strings.masterData}</span>
                </div>
                <div className={`progress-step ${currentGroup === 'review' ? 'active' : ''}`}> 
                  <div className="circle">4</div>
                  <span>{strings.review}</span>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>
          <main className="main">
            {step === 0 && <HomePage next={next} />}
            {step === 1 && (
              <ConfigMenuPage
                goToBasicInfo={() => setStep(2)}
                goToCompanyInfo={() => setStep(3)}
                goToPostingGroups={() => setStep(4)}
                goToPaymentTerms={() => setStep(5)}
              goToGLSetup={() => setStep(6)}
              goToSRSetup={() => setStep(7)}
              goToCustomers={() => setStep(8)}
              goToVendors={() => setStep(9)}
              goToItems={() => setStep(10)}
              back={back}
              companyDone={companyDone}
              glDone={glDone}
              srDone={srDone}
              />
            )}
            {step === 2 && (
              <BasicInfoPage
                formData={basicInfo}
                handleChange={handleChange}
                handleBlur={handleBlur}
          next={next}
          back={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <CompanyInfoPage
          fields={companyFields}
          renderInput={renderInput}
          handleRecommended={handleRecommended}
          next={next}
          back={() => setStep(1)}
          progress={companyProgress}
          setProgress={setCompanyProgress}
          visited={companyVisited}
          setVisited={setCompanyVisited}
        />
      )}
      {step === 4 && (
        <PostingGroupsPage
          formData={formData}
          handleChange={handleChange}
          handleBlur={handleBlur}
          next={next}
          back={back}
          askAI={openAIDialog}
        />
      )}
      {step === 5 && (
        <PaymentTermsPage
          formData={formData}
          handleChange={handleChange}
          handleBlur={handleBlur}
          next={next}
          back={back}
          askAI={openAIDialog}
          options={paymentTermsOptions}
        />
      )}
      {step === 6 && (
        <GLSetupPage
          fields={glFields}
          renderInput={renderInput}
          handleRecommended={handleRecommended}
          next={next}
          back={back}
          progress={glProgress}
          setProgress={setGlProgress}
          visited={glVisited}
          setVisited={setGlVisited}
        />
      )}
      {step === 7 && (
        <SalesReceivablesPage
          fields={srFields}
          renderInput={renderInput}
          handleRecommended={handleRecommended}
          next={next}
          back={back}
          progress={srProgress}
          setProgress={setSrProgress}
          visited={srVisited}
          setVisited={setSrVisited}
        />
      )}
          {step === 8 && <CustomersPage next={next} back={back} />}
          {step === 9 && <VendorsPage next={next} back={back} />}
          {step === 10 && <ItemsPage next={next} back={back} />}
          {step === 11 && (
            <ReviewPage
              fields={[...companyFields, ...glFields, ...srFields]}
              formData={formData}
              back={back}
              next={next}
            />
          )}
          {step === 12 && (
            <FinishPage
              generate={generateCustomRapidStart}
              back={back}
              downloadUrl={downloadUrl}
              debugMessages={debugMessages}
            />
          )}
          </main>
          {showAI && (
            <div className="modal-overlay" onClick={closeAIDialog}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="suggested-box">
                  <div className="suggested-label">Suggested Value</div>
                  <div className="suggested-value">{aiParsed.suggested || 'Loading...'}</div>
                </div>
                <div className="confidence"><strong>Confidence:</strong> {aiParsed.confidence}</div>
                <div className="ai-answer">{aiParsed.reasoning}</div>
            <textarea
              value={aiExtra}
              onChange={e => setAiExtra(e.target.value)}
              placeholder="Additional Instructions"
            />
            <button className="next-btn" onClick={askAgain}>Ask AI Assistant</button>
            <div className="nav">
              <button className="next-btn" onClick={acceptSuggested}>Accept</button>
              <button className="next-btn" onClick={closeAIDialog}>Cancel</button>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    );
  }

const container = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(container).render(<App />);

export default App;
