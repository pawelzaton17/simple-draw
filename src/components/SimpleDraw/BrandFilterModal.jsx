import "../../styles/BrandFilterModal.scss";

const BrandFilterModal = ({
  isOpen,
  onClose,
  allBrands,
  selectedBrands,
  setSelectedBrands,
}) => {
  if (!isOpen) return null;

  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2>🎯 Wybierz marki</h2>
        <div className="brand-list">
          {allBrands.map((brand) => (
            <label key={brand}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              />
              {brand}
            </label>
          ))}
        </div>
        <button className="close-btn" onClick={onClose}>
          Zamknij
        </button>
      </div>
    </div>
  );
};

export default BrandFilterModal;
