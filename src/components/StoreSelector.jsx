import React from "react";

const StoreSelector = ({ stores, selectedStore, onStoreChange }) => {
  return (
    <div className="store-selector">
      <label htmlFor="store-select">Wybierz sklep:</label>
      <select id="store-select" value={selectedStore} onChange={onStoreChange}>
        <option value="">-- wybierz --</option>
        {stores.map((store) => (
          <option key={store} value={store}>
            {store}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StoreSelector;
