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
      <h2>{strings.finishTitle}</h2>
      <p>{strings.finishGeneratePrompt}</p>
      <button onClick={generate}>{strings.generate}</button>
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
        <button onClick={back}>{strings.back}</button>
      </div>
    </div>
  );
}

export default FinishPage;
