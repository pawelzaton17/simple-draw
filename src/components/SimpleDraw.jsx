import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import winSound from "../sounds/goodresult-82807.mp3";
import {
  predefinedStores,
  cheatDayOptions,
  specialPlaces,
  storeProducts,
  brandProductMap,
} from "../constants/data.js";
import StoreSelector from "./SimpleDraw/StoreSelector.jsx";
import DrawButton from "./SimpleDraw/DrawButton.jsx";
import ResultDisplay from "./SimpleDraw/ResultDisplay.jsx";
import ToggleOptions from "./SimpleDraw/ToggleOptions.jsx";
import HistoryList from "./SimpleDraw/HistoryList.jsx";
import BrandFilterModal from "./SimpleDraw/BrandFilterModal.jsx";
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
  const [isAdvancedDraw, setIsAdvancedDraw] = useState(false);
  const [history, setHistory] = useState([]);
  const [showBrandFilter, setShowBrandFilter] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState(
    Object.keys(brandProductMap)
  );

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

  const handleDraw = () => {
    let product;

    if (isAdvancedDraw) {
      const brands = selectedBrands;
      const selectedBrand = brands[Math.floor(Math.random() * brands.length)];
      const brandProducts = brandProductMap[selectedBrand];
      const selectedBrandProduct =
        brandProducts[Math.floor(Math.random() * brandProducts.length)];
      product = `${selectedBrand} — ${selectedBrandProduct}`;
    } else {
      if (!selectedStore) return;
      product = storeProducts[Math.floor(Math.random() * storeProducts.length)];
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

      <StoreSelector
        stores={predefinedStores}
        selectedStore={selectedStore}
        onStoreChange={(e) => setSelectedStore(e.target.value)}
      />

      <DrawButton
        isAdvancedDraw={isAdvancedDraw}
        selectedStore={selectedStore}
        onDraw={handleDraw}
      />

      <ResultDisplay product={selectedProduct} />

      <ToggleOptions
        cheatDayEnabled={cheatDayEnabled}
        specialPlaceEnabled={specialPlaceEnabled}
        isAdvancedDraw={isAdvancedDraw}
        onCheatToggle={() => {
          setCheatDayEnabled(!cheatDayEnabled);
          if (!cheatDayEnabled) setSpecialPlaceEnabled(false);
        }}
        onSpecialToggle={() => {
          setSpecialPlaceEnabled(!specialPlaceEnabled);
          if (!specialPlaceEnabled) setCheatDayEnabled(false);
        }}
        onAdvancedToggle={() => setIsAdvancedDraw(!isAdvancedDraw)}
      />

      {isAdvancedDraw && (
        <button
          className="simple-draw__filter-button"
          onClick={() => setShowBrandFilter(true)}
        >
          🎯 Filtruj marki ({selectedBrands.length})
        </button>
      )}

      <HistoryList history={history} onClear={clearHistory} />

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
        />
      )}

      <BrandFilterModal
        isOpen={showBrandFilter}
        onClose={() => setShowBrandFilter(false)}
        allBrands={Object.keys(brandProductMap)}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
      />
    </div>
  );
};

export default SimpleDraw;
