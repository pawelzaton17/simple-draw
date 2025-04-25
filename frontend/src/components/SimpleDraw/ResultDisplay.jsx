const ResultDisplay = ({ product }) =>
  product && (
    <div className="simple-draw__result">
      <h2>🎉 Wylosowano:</h2>
      <p>{product}</p>
    </div>
  );

export default ResultDisplay;
