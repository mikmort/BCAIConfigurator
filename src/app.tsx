import React from 'react';
import ReactDOM from 'react-dom/client';

// Simple React app to guide users through Business Central setup
const { useState, useEffect } = React;
import HomePage from './pages/HomePage';
import ConfigMenuPage from './pages/ConfigMenuPage';
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
  const [showAI, setShowAI] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');

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

  function goHome(): void {
    setStep(1);
  }

  function openAIDialog(): void {
    setAiQuestion('');
    setAiAnswer('');
    setShowAI(true);
  }

  function closeAIDialog(): void {
    setShowAI(false);
  }

  async function submitQuestion() {
    if (!aiQuestion.trim()) return;
    const answer = await askOpenAI(aiQuestion);
    setAiAnswer(answer);
  }

  async function askOpenAI(question: string) {
    try {
      logDebug(`Asking OpenAI: ${question}`);
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
          messages: [{ role: 'user', content: question }],
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
    let inputProps: any = { name: key, value: val, onChange: handleChange };
    if (/phone/i.test(cf.field)) {
      inputProps.type = 'tel';
      inputProps.pattern = '[0-9+()\- ]+';
    } else if (/date/i.test(cf.field)) {
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
    const acceptRecommended = () => {
      setFormData((f: FormData) => ({
        ...f,
        [key]: recommendedCode(cf.recommended),
      }));
    };

    const handleRecommended = () => {
      if (cf.recommended) {
        const rec = recommendedCode(cf.recommended);
        if (window.confirm(`Suggested value: ${rec}. Use it?`)) {
          acceptRecommended();
        }
      }
    };

    return (
      <div className="field-row" key={key}>
        <div className="field-name">{cf.field}</div>
        <div className="field-input">
          {inputEl}
          {cf.recommended && (
            <span
              className="icon"
              role="button"
              title="Use recommended value"
              onClick={handleRecommended}
            >
              ⭐
            </span>
          )}
          <span className="icon" role="button" title="Ask AI" onClick={openAIDialog}>
            🤖
          </span>
        </div>
        <div className="field-considerations">{cf.considerations}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="navbar">
        <a href="#" onClick={goHome}>
          Home
        </a>
      </div>
      {step !== 0 && <h1>Business Central Setup</h1>}
      {step === 0 && <HomePage next={next} />}
      {step === 1 && (
        <ConfigMenuPage
          goToCompanyInfo={() => setStep(2)}
          goToPostingGroups={() => setStep(3)}
          goToPaymentTerms={() => setStep(4)}
          back={back}
        />
      )}
      {step === 2 && (
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
      {step === 3 && (
        <PostingGroupsPage
          formData={formData}
          handleChange={handleChange}
          next={next}
          back={back}
          askAI={openAIDialog}
        />
      )}
      {step === 4 && (
        <PaymentTermsPage
          formData={formData}
          handleChange={handleChange}
          next={next}
          back={back}
          askAI={openAIDialog}
        />
      )}
      {step === 5 && (
        <FinishPage
          generate={generateCustomRapidStart}
          back={back}
          downloadUrl={downloadUrl}
          debugMessages={debugMessages}
        />
      )}
      {showAI && (
        <div className="modal-overlay" onClick={closeAIDialog}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <textarea
              value={aiQuestion}
              onChange={e => setAiQuestion(e.target.value)}
              placeholder="Ask a question"
            />
            <button onClick={submitQuestion}>Ask</button>
            {aiAnswer && <div className="ai-answer">{aiAnswer}</div>}
            <div className="nav">
              <button onClick={closeAIDialog}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(container).render(<App />);

export default App;
