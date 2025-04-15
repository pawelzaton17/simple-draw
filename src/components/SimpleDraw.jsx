import React, { useState } from "react";
import Confetti from "react-confetti";
import winSound from "../sounds/goodresult-82807.mp3";
import StoreSelector from "./StoreSelector";
import ProductDrawer from "./ProductDrawer";
import ResultDisplay from "./ResultDisplay";
import { predefinedStores, cheatDayOptions, specialPlaces, storeProducts } from "../constants/data";
import "./SimpleDraw.scss";

const SimpleDraw = () => {
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cheatDayEnabled, setCheatDayEnabled] = useState(false);
  const [specialPlaceEnabled, setSpecialPlaceEnabled] = useState(false);
  const [result, setResult] = useState("");

  const audio = new Audio(winSound);
  audio.volume = 0.3;

  const handleStoreChange = (e) => {
    setSelectedStore(e.target.value);
  };

  const drawProduct = () => {
    let drawnProduct;
    if (cheatDayEnabled) {
      const weightedOptions = [...cheatDayOptions, ...cheatDayOptions, cheatDayOptions[0]];
      drawnProduct = weightedOptions[Math.floor(Math.random() * weightedOptions.length)];
    } else if (specialPlaceEnabled) {
      const options = [];
      if (selectedStore) {
        options.push("normal", "normal", "normal", "normal");
      }
      options.push("special");
      const drawType = options[Math.floor(Math.random() * options.length)];
      if (drawType === "special") {
        drawnProduct = specialPlaces[0];
      } else {
        if (!selectedStore) return;
        drawnProduct = storeProducts[Math.floor(Math.random() * storeProducts.length)];
      }
    } else {
      if (!selectedStore) return;
      drawnProduct = storeProducts[Math.floor(Math.random() * storeProducts.length)];
    }
    setResult(drawnProduct);
    setShowConfetti(true);
    audio.play().catch(() => {});
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="simple-draw-container">
      <h1> 🍕 Losowanie Produktu 🍕 </h1>
      <StoreSelector
        stores={predefinedStores}
        selectedStore={selectedStore}
        onStoreChange={handleStoreChange}
      />
      <ProductDrawer onDraw={drawProduct} isStoreSelected={!!selectedStore} />
      <ResultDisplay product={result} />
      <div className="toggles">
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
