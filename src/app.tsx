// Simple React app to guide users through Business Central setup
const { useState, useEffect } = React;

interface FormData {
  companyName: string;
  address: string;
  country: string;
  postingGroup: string;
  paymentTerms: string;
}

function App() {
  const [step, setStep] = useState(0 as number);
  const [rapidStart, setRapidStart] = useState('' as string);
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    country: '',
    postingGroup: '',
    paymentTerms: '',
  } as FormData);

  useEffect(() => {
    // Load starting data from Azure Blob Storage
    async function loadStartingData() {
      try {
        const resp = await fetch('https://bconfigstorage.blob.core.windows.net/bctemplates/NAV27.0.US.ENU.EXTENDED.json');
        const data = await resp.json();
        setRapidStart(JSON.stringify(data));
        const key = Object.keys(data).find(k => k.toLowerCase().includes('payment') && k.toLowerCase().includes('term'));
        if (key) {
          const val = data[key];
          let terms = '';
          if (typeof val === 'string') {
            terms = val;
          } else if (Array.isArray(val)) {
            const first = val[0];
            if (typeof first === 'string') terms = first;
            else if (first && typeof first === 'object') terms = first.Code || first.Description || '';
          } else if (val && typeof val === 'object') {
            terms = val.Code || val.Description || '';
          }
          setFormData((f: any) => ({ ...f, paymentTerms: terms }));
        }
      } catch (e) {
        console.error('Failed to load starting data', e);
      }
    }
    loadStartingData();
  }, []);

  function handleChange(e: any) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      const resp = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await resp.json();
      alert(data.answer);
    } catch (e) {
      console.error(e);
    }
  }

  function generateCustomRapidStart(): void {
    const xml = `<?xml version="1.0"?>\n<CustomRapidStart>\n  <CompanyName>${formData.companyName}</CompanyName>\n  <Address>${formData.address}</Address>\n  <Country>${formData.country}</Country>\n  <PostingGroup>${formData.postingGroup}</PostingGroup>\n  <PaymentTerms>${formData.paymentTerms}</PaymentTerms>\n</CustomRapidStart>`;
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CustomRapidStart.xml';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app">
      <h1>Business Central Setup</h1>
      {step === 0 && (
        <div>
          <p>Welcome! This wizard will help you configure Dynamics 365 Business Central.</p>
          <button onClick={next}>Start</button>
        </div>
      )}
      {step === 1 && (
        <div>
          <h2>Company Information</h2>
          <label>
            Company Name:
            <input name="companyName" value={formData.companyName} onChange={handleChange} />
          </label>
          <label>
            Address:
            <input name="address" value={formData.address} onChange={handleChange} />
          </label>
          <label>
            Country:
            <input name="country" value={formData.country} onChange={handleChange} />
          </label>
          <button onClick={() => askOpenAI('What is a good company name?')}>Need help?</button>
          <div className="nav">
            <button onClick={back}>Back</button>
            <button onClick={next}>Next</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Posting Groups</h2>
          <label>
            General Posting Group:
            <input name="postingGroup" value={formData.postingGroup} onChange={handleChange} />
          </label>
          <div className="nav">
            <button onClick={back}>Back</button>
            <button onClick={next}>Next</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2>Payment Terms</h2>
          <label>
            Terms:
            <input name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} />
          </label>
          <div className="nav">
            <button onClick={back}>Back</button>
            <button onClick={next}>Next</button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div>
          <h2>Finish</h2>
          <p>Click below to generate your CustomRapidStart.xml file.</p>
          <button onClick={generateCustomRapidStart}>Generate</button>
          <div className="nav">
            <button onClick={back}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(container).render(<App />);
