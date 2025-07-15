interface Props {
  generate: () => Promise<void>;
  back: () => void;
  downloadUrl: string;
  debugMessages: string[];
}

function FinishPage({ generate, back, downloadUrl, debugMessages }: Props) {
  return (
    <div>
      <h2>Finish</h2>
      <p>Click below to generate your RapidStart file.</p>
      <button onClick={generate}>Generate</button>
      {downloadUrl && (
        <p>
          File created: <a href={downloadUrl}>{downloadUrl}</a>
        </p>
      )}
      {debugMessages.length > 0 && (
        <div className="debug">
          <h3>Debug Log</h3>
          <pre>{debugMessages.join('\n')}</pre>
        </div>
      )}
      <div className="nav">
        <button onClick={back}>Back</button>
      </div>
    </div>
  );
}

export default FinishPage;
