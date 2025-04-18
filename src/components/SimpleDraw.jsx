import { useState } from "react";
import Confetti from "react-confetti";
import winSound from "../sounds/goodresult-82807.mp3";
import StoreSelector from "./StoreSelector";
import ProductDrawer from "./ProductDrawer";
import ResultDisplay from "./ResultDisplay";
import {
  predefinedStores,
  cheatDayOptions,
  specialPlaces,
  storeProducts,
  brandProducts,
} from "../constants/data";
import "../styles/SimpleDraw.scss";

const weightedRandom = (items, weights) => {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const rnd = Math.random() * totalWeight;
  let cumulative = 0;
  for (let i = 0; i < items.length; i++) {
    cumulative += weights[i];
    if (rnd < cumulative) return items[i];
  }
};

const SimpleDraw = () => {
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cheatDayEnabled, setCheatDayEnabled] = useState(false);
  const [specialPlaceEnabled, setSpecialPlaceEnabled] = useState(false);
  const [standardMode, setStandardMode] = useState(false); // <--- nowy checkbox

  const audio = new Audio(winSound);
  audio.volume = 0.1;

  const handleStoreChange = (e) => {
    setSelectedStore(e.target.value);
  };

  const drawProduct = () => {
    let product;

    if (standardMode) {
      // stare losowanie
      if (cheatDayEnabled) {
        const pool = [...storeProducts, ...cheatDayOptions];
        const weights = [
          ...storeProducts.map(() => 1),
          ...cheatDayOptions.map(() => 1.3),
        ];
        product = weightedRandom(pool, weights);
      } else if (specialPlaceEnabled) {
        const pool = [...storeProducts, ...specialPlaces];
        const weights = [
          ...storeProducts.map(() => 1),
          ...specialPlaces.map(() => 1.3),
        ];
        product = weightedRandom(pool, weights);
      } else {
        if (!selectedStore) return;
        product =
          storeProducts[Math.floor(Math.random() * storeProducts.length)];
      }
    } else {
      // nowe losowanie: marka + produkt
      const brands = Object.keys(brandProducts);
      const selectedBrand = brands[Math.floor(Math.random() * brands.length)];
      const products = brandProducts[selectedBrand];
      const selectedProduct =
        products[Math.floor(Math.random() * products.length)];
      product = `${selectedBrand} ➜ ${selectedProduct}`;
    }

    setSelectedProduct(product);
    setShowConfetti(true);
    audio.play().catch(() => {});
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="simple-draw-container">
      <h1>🍫 Losowanie Produktu 🍔</h1>
      <StoreSelector
        stores={predefinedStores}
        selectedStore={selectedStore}
        onStoreChange={handleStoreChange}
      />
      <ProductDrawer
        onDraw={drawProduct}
        isStoreSelected={!!selectedStore || !standardMode}
      />
      <ResultDisplay product={selectedProduct} />
      <div className="toggles">
        <label>
          <input
            type="checkbox"
            checked={cheatDayEnabled}
            onChange={() => {
              setCheatDayEnabled(!cheatDayEnabled);
              if (!cheatDayEnabled) setSpecialPlaceEnabled(false);
            }}
            disabled={!standardMode}
          />
          Cheat Day?
        </label>
        <label>
          <input
            type="checkbox"
            checked={specialPlaceEnabled}
            onChange={() => {
              setSpecialPlaceEnabled(!specialPlaceEnabled);
              if (!specialPlaceEnabled) setCheatDayEnabled(false);
            }}
            disabled={!standardMode}
          />
          Sklep specjalny?
        </label>
        <label>
          <input
            type="checkbox"
            checked={standardMode}
            onChange={() => setStandardMode(!standardMode)}
          />
          Standardowe Losowanie
        </label>
      </div>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
        />
      )}
    </div>
  );
};

export default SimpleDraw;
