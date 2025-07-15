// Simple React app to guide users through Business Central setup
const { useState, useEffect } = React;

function App() {
  const [step, setStep] = useState(0);
  const [rapidStart, setRapidStart] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    country: '',
    postingGroup: '',
    paymentTerms: '',
  });

  useEffect(() => {
    // Load RapidStart.xml from Azure Blob Storage
    async function loadRapidStart() {
      try {
        const resp = await fetch('https://<your-storage-account>.blob.core.windows.net/<container>/RapidStart.xml');
        const text = await resp.text();
        setRapidStart(text);
      } catch (e) {
        console.error('Failed to load RapidStart.xml', e);
      }
    }
    loadRapidStart();
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function next() {
    setStep(step + 1);
  }

  function back() {
    setStep(step - 1);
  }

  async function askOpenAI(question) {
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

  function generateCustomRapidStart() {
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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
