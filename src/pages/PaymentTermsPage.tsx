import strings from '../../res/strings';

interface Props {
  formData: { [key: string]: any };
  handleChange: (e: any) => void;
  handleBlur: (e: any) => void;
  next: () => void;
  back: () => void;
  askAI: (field: string, key: string, cons?: string) => void;
}

function PaymentTermsPage({
  formData,
  handleChange,
  handleBlur,
  next,
  back,
  askAI,
}: Props) {
  return (
    <div>
      <h2>{strings.paymentTerms}</h2>
      <div className="field-row">
        <div className="field-name">{strings.paymentTermsLabel}</div>
        <div className="field-input">
          <input
            name="paymentTerms"
            value={formData.paymentTerms || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
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
