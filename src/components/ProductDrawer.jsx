const ProductDrawer = ({ onDraw, isStoreSelected }) => {
  return (
    <div className="product-drawer">
      <button onClick={onDraw} disabled={!isStoreSelected}>
        {isStoreSelected ? "Losuj produkt" : "Wybierz sklep"}
      </button>
    </div>
  );
};

export default ProductDrawer;
