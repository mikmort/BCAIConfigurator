import strings from '../../res/strings';

interface Props {
  generate: () => Promise<void>;
  back: () => void;
  downloadUrl: string;
  debugMessages: string[];
}

function FinishPage({ generate, back, downloadUrl, debugMessages }: Props) {
  return (
    <div>
      <div className="section-header">{strings.finishTitle}</div>
      <p>{strings.finishGeneratePrompt}</p>
      <button className="next-btn" onClick={generate}>{strings.generate}</button>
      {downloadUrl && (
        <p>
          {strings.fileCreated} <a href={downloadUrl}>{downloadUrl}</a>
        </p>
      )}
      {debugMessages.length > 0 && (
        <div className="debug">
          <h3>{strings.debugLog}</h3>
          <pre>{debugMessages.join('\n')}</pre>
        </div>
      )}
      <div className="nav">
        <button className="back-btn" onClick={back}>{strings.back}</button>
      </div>
    </div>
  );
}

export default FinishPage;
