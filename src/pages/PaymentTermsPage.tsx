interface Props {
  formData: { [key: string]: any };
  handleChange: (e: any) => void;
  next: () => void;
  back: () => void;
}

function PaymentTermsPage({ formData, handleChange, next, back }: Props) {
  return (
    <div>
      <h2>Payment Terms</h2>
      <label>
        Terms:
        <input name="paymentTerms" value={formData.paymentTerms || ''} onChange={handleChange} />
      </label>
      <div className="nav">
        <button onClick={back}>Back</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
}

export default PaymentTermsPage;
