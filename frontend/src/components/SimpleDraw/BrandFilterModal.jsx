import "../../styles/BrandFilterModal.scss"; // Import your CSS styles here

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

  return (
    <div className="modal-overlay">
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
