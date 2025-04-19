const HistoryList = ({ history, onClear }) => (
  <div className="simple-draw__history">
    <h3>🕒 Historia losowań</h3>
    {history.length === 0 ? (
      <p>Brak historii.</p>
    ) : (
      <>
        <ul className="simple-draw__history-list">
          {history.map((entry, index) => (
            <li key={index}>
              <span>{entry.timestamp}</span> – <strong>{entry.product}</strong>
            </li>
          ))}
        </ul>
        <button className="simple-draw__history-clear-btn" onClick={onClear}>
          Wyczyść historię
        </button>
      </>
    )}
  </div>
);

export default HistoryList;
