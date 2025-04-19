const DrawButton = ({ isAdvancedDraw, selectedStore, onDraw }) => (
  <button
    className="simple-draw__draw-button"
    onClick={onDraw}
    disabled={!isAdvancedDraw && !selectedStore}
  >
    🎲 Losuj Produkt
  </button>
);

export default DrawButton;
