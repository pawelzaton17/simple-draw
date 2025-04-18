import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import winSound from "../sounds/goodresult-82807.mp3";
import {
  predefinedStores,
  cheatDayOptions,
  specialPlaces,
  storeProducts,
  brandProductMap,
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
  const [standardDraw, setStandardDraw] = useState(false);
  const [history, setHistory] = useState([]);

  const audio = new Audio(winSound);
  audio.volume = 0.1;

  useEffect(() => {
    const storedHistory = localStorage.getItem("drawHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("drawHistory", JSON.stringify(history));
  }, [history]);

  const handleStoreChange = (e) => {
    setSelectedStore(e.target.value);
  };

  const drawProduct = () => {
    let product;

    if (standardDraw) {
      if (!selectedStore) return;
      product = storeProducts[Math.floor(Math.random() * storeProducts.length)];
    } else {
      const brands = Object.keys(brandProductMap);
      const selectedBrand = brands[Math.floor(Math.random() * brands.length)];
      const brandProducts = brandProductMap[selectedBrand];
      const selectedBrandProduct =
        brandProducts[Math.floor(Math.random() * brandProducts.length)];
      product = `${selectedBrand} — ${selectedBrandProduct}`;
    }

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
    }

    const timestamp = new Date().toLocaleString();
    setSelectedProduct(product);
    setHistory([{ product, timestamp }, ...history]);
    setShowConfetti(true);
    audio.play().catch(() => {});
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("drawHistory");
  };

  return (
    <div className="simple-draw__container">
      <h1 className="simple-draw__title">🍫 Losowanie Produktu 🍔</h1>

      <div className="simple-draw__store-selector">
        <label htmlFor="store-select">Wybierz sklep:</label>
        <select
          id="store-select"
          value={selectedStore}
          onChange={handleStoreChange}
        >
          <option value="">-- wybierz --</option>
          {predefinedStores.map((store) => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={drawProduct}
        disabled={!selectedStore && standardDraw}
        className="simple-draw__draw-button"
      >
        {standardDraw && !selectedStore ? "Wybierz sklep" : "Losuj produkt"}
      </button>

      <div className="simple-draw__result">
        {selectedProduct && (
          <h2>
            🎉 Dziś kup: <span className="highlight">{selectedProduct}</span>
          </h2>
        )}
      </div>

      <div className="simple-draw__toggles">
        <label>
          <input
            type="checkbox"
            checked={cheatDayEnabled}
            onChange={() => {
              setCheatDayEnabled(!cheatDayEnabled);
              if (!cheatDayEnabled) setSpecialPlaceEnabled(false);
            }}
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
          />
          Sklep specjalny?
        </label>
        <label>
          <input
            type="checkbox"
            checked={standardDraw}
            onChange={() => setStandardDraw(!standardDraw)}
          />
          Standardowe losowanie
        </label>
      </div>

      <div className="simple-draw__history">
        <h3>📜 Historia losowań</h3>
        <ul className="simple-draw__history-list">
          {history.map((entry, idx) => (
            <li key={idx}>
              <strong>{entry.product}</strong>
              <em>{entry.timestamp}</em>
            </li>
          ))}
        </ul>
        {history.length > 0 && (
          <button
            className="simple-draw__history-clear-btn"
            onClick={clearHistory}
          >
            Wyczyść historię
          </button>
        )}
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
