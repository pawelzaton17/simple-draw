const StoreSelector = ({ stores, selectedStore, onStoreChange }) => (
  <div className="simple-draw__store-selector">
    <label htmlFor="store">Wybierz sklep:</label>
    <select id="store" value={selectedStore} onChange={onStoreChange}>
      <option value="">-- Wybierz --</option>
      {stores.map((store) => (
        <option key={store} value={store}>
          {store}
        </option>
      ))}
    </select>
  </div>
);

export default StoreSelector;
