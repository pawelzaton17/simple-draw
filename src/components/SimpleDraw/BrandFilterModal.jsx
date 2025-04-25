import { useEffect } from "react";
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
    setSelectedBrands((prevSelectedBrands) => {
      const updatedBrands = prevSelectedBrands.includes(brand)
        ? prevSelectedBrands.filter((b) => b !== brand)
        : [...prevSelectedBrands, brand];

      return updatedBrands;
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  if (!isOpen) return null;

  if (
    !allBrands ||
    !Array.isArray(allBrands) ||
    !Array.isArray(selectedBrands)
  ) {
    console.error("BrandFilterModal received invalid props");
    return null;
  }

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
