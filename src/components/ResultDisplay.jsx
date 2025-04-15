const ResultDisplay = ({ product }) => {
  return (
    <div className="result-display">
      {product && (
        <h2>
          🎉 Dziś kup: <span className="highlight">{product}</span>
        </h2>
      )}
    </div>
  );
};

export default ResultDisplay;
