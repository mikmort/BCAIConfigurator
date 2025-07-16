import React from 'react';
import ReactDOM from 'react-dom/client';

// Simple React app to guide users through Business Central setup
const { useState, useEffect } = React;
import HomePage from './pages/HomePage';
import CompanyInfoPage from './pages/CompanyInfoPage';
import PostingGroupsPage from './pages/PostingGroupsPage';
import PaymentTermsPage from './pages/PaymentTermsPage';
import FinishPage from './pages/FinishPage';
import { CompanyField } from './types';
import { fieldKey } from './utils/helpers';
import { parseCompanyInfo, recommendedCode } from './utils/jsonParsing';
import { loadStartingData, loadConfigTables } from './utils/dataLoader';

interface FormData {
  [key: string]: any;
}


function App() {
  const [step, setStep] = useState(0 as number);
  const [rapidStart, setRapidStart] = useState('' as string);
  const [formData, setFormData] = useState({} as FormData);
  const [companyFields, setCompanyFields] = useState([] as CompanyField[]);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [debugMessages, setDebugMessages] = useState([] as string[]);
  const [countries, setCountries] = useState([] as { code: string; name: string }[]);

  const commonFieldNames = new Set([
    'Company Name',
    'Address',
    'Phone No./Email',
    'Country/Region Code',
  ]);
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

        const countries =
          data?.DataList?.CountryRegionList?.CountryRegion?.map((c: any) => ({
            code: c.Code?.['#text'] || '',
            name: c.Name?.['#text'] || '',
          })) || [];
        setCountries(countries);

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
    async function init() {
      try {
        logDebug('Loading config tables');
        const data = await loadConfigTables();
        if (data['Table 79']) {
          const fields = parseCompanyInfo(data['Table 79']);
          setCompanyFields(fields);
          setFormData((f: FormData) => {
            const copy: FormData = { ...f };
            fields.forEach((cf: CompanyField) => {
              const key = fieldKey(cf.field);
              if (!(key in copy)) copy[key] = '';
            });
            return copy;
          });
        }
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
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  function next(): void {
    setStep(step + 1);
  }

  function back(): void {
    setStep(step - 1);
  }

  async function askOpenAI(question: string) {
    // Placeholder for Azure OpenAI integration
    try {
      logDebug(`Asking OpenAI: ${question}`);
      const resp = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await resp.json();
      alert(data.answer);
      logDebug('OpenAI answered');
    } catch (e) {
      console.error(e);
      logDebug(`OpenAI call failed: ${e}`);
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

  function renderField(cf: CompanyField) {
    const key = fieldKey(cf.field);
    const val = formData[key] || '';
    let inputEl: any = (
      <input name={key} value={val} onChange={handleChange} />
    );
    if (cf.field === 'Logo (Picture)') {
      inputEl = <input type="file" name={key} onChange={handleChange} />;
    } else if (cf.field === 'Base Calendar Code') {
      const options = ['', 'STANDARD'];
      inputEl = (
        <select name={key} value={val} onChange={handleChange}>
          {options.map(o => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    } else if (cf.field === 'Country/Region Code') {
      inputEl = (
        <select name={key} value={val} onChange={handleChange}>
          <option value=""></option>
          {countries.map((c: { code: string; name: string }) => (
            <option key={c.code} value={c.code}>
              {c.name || c.code}
            </option>
          ))}
        </select>
      );
    }
    const showButton =
      cf.recommended &&
      suggestionFields.has(cf.field) &&
      val !== recommendedCode(cf.recommended);
    return (
      <div className="field" key={key}>
        <label>
          {cf.field}: {inputEl}
        </label>
        {showButton && (
          <button
            type="button"
            onClick={() =>
              setFormData((f: FormData) => ({
                ...f,
                [key]: recommendedCode(cf.recommended),
              }))
            }
          >
            Use suggested
          </button>
        )}
        {cf.recommended && (
          <div className="suggested">Suggested: {cf.recommended}</div>
        )}
        {cf.considerations && (
          <details>
            <summary>Considerations</summary>
            <p>{cf.considerations}</p>
          </details>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Business Central Setup</h1>
      {step === 0 && <HomePage next={next} />}
      {step === 1 && (
        <CompanyInfoPage
          fields={companyFields}
          commonFieldNames={commonFieldNames}
          formData={formData}
          handleChange={handleChange}
          renderField={renderField}
          next={next}
          back={back}
        />
      )}
      {step === 2 && (
        <PostingGroupsPage
          formData={formData}
          handleChange={handleChange}
          next={next}
          back={back}
        />
      )}
      {step === 3 && (
        <PaymentTermsPage
          formData={formData}
          handleChange={handleChange}
          next={next}
          back={back}
        />
      )}
      {step === 4 && (
        <FinishPage
          generate={generateCustomRapidStart}
          back={back}
          downloadUrl={downloadUrl}
          debugMessages={debugMessages}
        />
      )}
    </div>
  );
}

const container = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(container).render(<App />);

export default App;
