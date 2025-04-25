import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import StoreSelector from "./SimpleDraw/StoreSelector.jsx";
import DrawButton from "./SimpleDraw/DrawButton.jsx";
import ResultDisplay from "./SimpleDraw/ResultDisplay.jsx";
import ToggleOptions from "./SimpleDraw/ToggleOptions.jsx";
import HistoryList from "./SimpleDraw/HistoryList.jsx";
import BrandFilterModal from "./SimpleDraw/BrandFilterModal.jsx";
import useContentfulDataFetchers from "../hooks/useContentfulDataFetchers.js";
import useLocalStorage from "../hooks/useLocalStorage.js";
import useAudio from "../hooks/useAudio.js";
import useFetchBrandProducts from "../hooks/useFetchBrandProducts.js";
import { fetchEntries } from "../api/contentfulClient";
import winSound from "../sounds/goodresult-82807.mp3";
import "../styles/SimpleDraw.scss";

const SimpleDraw = () => {
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cheatDayEnabled, setCheatDayEnabled] = useState(false);
  const [specialPlaceEnabled, setSpecialPlaceEnabled] = useState(false);
  const [isAdvancedDraw, setIsAdvancedDraw] = useState(false);
  const [showBrandFilter, setShowBrandFilter] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [history, setHistory] = useLocalStorage("drawHistory", []);
  const playWinSound = useAudio(winSound, 0.1);

  const dataFetchers = [
    {
      key: "predefinedStores",
      fetcher: () => fetchEntries("predefinedStores"),
      mapper: (store) => store.storeName,
    },
    {
      key: "commonProducts",
      fetcher: () => fetchEntries("commonProducts"),
      mapper: (product) => product.product,
    },
    {
      key: "cheatDayOptions",
      fetcher: () => fetchEntries("cheatDayOptions"),
      mapper: (option) => option.cheatDayOption,
    },
    {
      key: "specialPlaces",
      fetcher: () => fetchEntries("specialPlaces"),
      mapper: (place) => place.specialPlace,
    },
  ];

  const { data, loading, error } = useContentfulDataFetchers(dataFetchers);
  const { brandProductMap, loading: loadingBrands } = useFetchBrandProducts();

  useEffect(() => {
    if (!loadingBrands && brandProductMap) {
      setSelectedBrands(Object.keys(brandProductMap));
    }
  }, [loadingBrands, brandProductMap]);

  const loadingAll = loading || loadingBrands;

  if (loadingAll) {
    return (
      <div className="simple-draw__container">
        <h1 className="simple-draw__title">🍫 Losowanie Produktu 🍔</h1>
        <p>Ładowanie danych...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="simple-draw__container">
        <h1 className="simple-draw__title">🍫 Losowanie Produktu 🍔</h1>
        <p>Błąd podczas ładowania danych: {error.message}</p>
      </div>
    );
  }

  const { predefinedStores, commonProducts, cheatDayOptions, specialPlaces } =
    data;

  const getRandomItem = (array) =>
    array[Math.floor(Math.random() * array.length)];

  const finalizeDraw = (product) => {
    const timestamp = new Date().toLocaleString();
    setHistory([{ product, timestamp }, ...history]);
    setSelectedProduct(product);
    setShowConfetti(true);
    playWinSound();
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleDraw = () => {
    if (isAdvancedDraw) {
      const selectedBrand = getRandomItem(selectedBrands);
      const product = `${selectedBrand} — ${getRandomItem(
        brandProductMap[selectedBrand]
      )}`;
      finalizeDraw(product);
      return;
    }

    if (!selectedStore) return;

    let product = getRandomItem(commonProducts);

    if (cheatDayEnabled) {
      product = getRandomItem(cheatDayOptions);
    } else if (specialPlaceEnabled) {
      product = getRandomItem(specialPlaces);
    }

    finalizeDraw(product);
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
        onCheatToggle={() => setCheatDayEnabled(!cheatDayEnabled)}
        onSpecialToggle={() => setSpecialPlaceEnabled(!specialPlaceEnabled)}
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

      <HistoryList history={history} onClear={() => setHistory([])} />

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
        allBrands={brandProductMap ? Object.keys(brandProductMap) : []}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
      />
    </div>
  );
};

export default SimpleDraw;
