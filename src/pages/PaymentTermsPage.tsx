import strings from '../../res/strings';

interface Props {
  formData: { [key: string]: any };
  handleChange: (e: any) => void;
  handleBlur: (e: any) => void;
  next: () => void;
  back: () => void;
  askAI: (field: string, key: string, cons?: string) => void;
  options: { code: string; description: string }[];
}

function PaymentTermsPage({
  formData,
  handleChange,
  handleBlur,
  next,
  back,
  askAI,
  options,
}: Props) {
  return (
    <div>
      <h2>{strings.paymentTerms}</h2>
      <div className="field-row">
        <div className="field-name">{strings.paymentTermsLabel}</div>
        <div className="field-input">
          <input
            list="payment-terms-list"
            name="paymentTerms"
            value={formData.paymentTerms || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <datalist id="payment-terms-list">
            {options.map(o => (
              <option key={o.code} value={o.code}>
                {o.description || o.code}
              </option>
            ))}
          </datalist>
          <span className="icon" role="button" title="Use recommended value">⭐</span>
          <span
            className="icon"
            role="button"
            title="Ask AI"
            onClick={() => askAI(strings.paymentTermsLabel, 'paymentTerms')}
          >
            🤖
          </span>
        </div>
        <div className="field-considerations"></div>
      </div>
      <div className="nav">
        <button onClick={back}>{strings.back}</button>
        <button onClick={next}>{strings.next}</button>
      </div>
    </div>
  );
}

export default PaymentTermsPage;
