import React from 'react';
import ReactDOM from 'react-dom/client';

// Simple React app to guide users through Business Central setup
const { useState, useEffect } = React;
import HomePage from './pages/HomePage';
import CompanyInfoPage from './pages/CompanyInfoPage';
import PostingGroupsPage from './pages/PostingGroupsPage';
import PaymentTermsPage from './pages/PaymentTermsPage';
import FinishPage from './pages/FinishPage';

interface CompanyField {
  field: string;
  recommended: string;
  considerations: string;
}

interface FormData {
  [key: string]: any;
}

function fieldKey(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '_');
}

function recommendedCode(text: string): string {
  const match = text.match(/[A-Z0-9]{2,}/);
  return match ? match[0] : text;
}

function parseCompanyInfo(text: string): CompanyField[] {
  const lines = text.split('\n').map(l => l.trim());
  const names = [
    'Company Name',
    'Address',
    'Phone No. /',
    'Country/Region',
    'Tax',
    'Fed. Tax ID (if',
    'Company',
    'Base Calendar',
    'Invoice Address',
    'Logo (Picture)',
    'Bank Accounts',
  ];
  const displayNames = [
    'Company Name',
    'Address',
    'Phone No./Email',
    'Country/Region Code',
    'Tax Registration No.',
    'Fed. Tax ID (if available)',
    'Company Website',
    'Base Calendar Code',
    'Invoice Address Code',
    'Logo (Picture)',
    'Bank Accounts',
  ];
  const indexes = names.map(n => lines.indexOf(n));
  indexes.push(lines.length);
  const result: CompanyField[] = [];
  for (let i = 0; i < names.length; i++) {
    const slice = lines.slice(indexes[i] + 1, indexes[i + 1]).filter(l => l);
    while (slice[0] && (/Blank/i.test(slice[0]) || /None/i.test(slice[0]) || /^\(/.test(slice[0]) || /City/.test(slice[0]) || /ZIP/.test(slice[0]) || /Code$/.test(slice[0]) || /available\)/.test(slice[0]) || /fields/i.test(slice[0]))) {
      slice.shift();
    }
    const idxCons = slice.findIndex(l => l.startsWith('The ') || l.startsWith('If ') || l.startsWith('Bank ') || l.startsWith('Note:'));
    const rec = idxCons >= 0 ? slice.slice(0, idxCons) : slice;
    const cons = idxCons >= 0 ? slice.slice(idxCons) : [];
    result.push({
      field: displayNames[i],
      recommended: rec.join(' ').trim(),
      considerations: cons.join(' ').trim(),
    });
  }
  return result;
}

function xmlToJson(node: Element): any {
  const obj: any = {};
  if (node.attributes) {
    Array.from(node.attributes).forEach(attr => {
      obj[`@${attr.name}`] = attr.value;
    });
  }
  const children = Array.from(node.childNodes).filter(n => n.nodeType === 1);
  const textNodes = Array.from(node.childNodes).filter(n => n.nodeType === 3);
  if (textNodes.length) {
    const text = textNodes.map(n => n.nodeValue?.trim()).join('');
    if (text) obj['#text'] = text;
  }
  children.forEach(child => {
    const el = child as Element;
    const name = el.nodeName;
    const val = xmlToJson(el);
    if (obj[name]) {
      if (!Array.isArray(obj[name])) obj[name] = [obj[name]];
      obj[name].push(val);
    } else {
      obj[name] = val;
    }
  });
  return obj;
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
    // Load starting data from local template
    async function loadStartingData() {
      try {
        logDebug('Loading starting data');
        const resp = await fetch('NAV27.0.US.ENU.STANDARD.xml');
        const text = await resp.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');
        const data = {
          [xmlDoc.documentElement.nodeName]: xmlToJson(xmlDoc.documentElement),
        } as any;
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
    loadStartingData();
  }, []);

  useEffect(() => {
    async function loadConfigTables() {
      try {
        logDebug('Loading config tables');
        const resp = await fetch('/config_tables.json');
        const data = await resp.json();
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
    loadConfigTables();
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
