import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import winSound from "../sounds/goodresult-82807.mp3";
import StoreSelector from "./SimpleDraw/StoreSelector.jsx";
import DrawButton from "./SimpleDraw/DrawButton.jsx";
import ResultDisplay from "./SimpleDraw/ResultDisplay.jsx";
import ToggleOptions from "./SimpleDraw/ToggleOptions.jsx";
import HistoryList from "./SimpleDraw/HistoryList.jsx";
import BrandFilterModal from "./SimpleDraw/BrandFilterModal.jsx";
import { fetchEntries, fetchBrandProductMap } from "../api/contentfulClient";
import "../styles/SimpleDraw.scss";

const SimpleDraw = () => {
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cheatDayEnabled, setCheatDayEnabled] = useState(false);
  const [specialPlaceEnabled, setSpecialPlaceEnabled] = useState(false);
  const [isAdvancedDraw, setIsAdvancedDraw] = useState(false);
  const [history, setHistory] = useState([]);
  const [showBrandFilter, setShowBrandFilter] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [predefinedStores, setPredefinedStores] = useState([]);
  const [commonProducts, setCommonProducts] = useState([]);
  const [cheatDayOptions, setCheatDayOptions] = useState([]);
  const [specialPlaces, setSpecialPlaces] = useState([]);
  const [brandProductMap, setBrandProductMap] = useState({});
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stores = await fetchEntries("predefinedStores");
        const products = await fetchEntries("commonProducts");
        const cheatOptions = await fetchEntries("cheatDayOptions");
        const places = await fetchEntries("specialPlaces");
        const brandMap = await fetchBrandProductMap();

        setPredefinedStores(stores.map((store) => store.storeName));
        setCommonProducts(products.map((product) => product.product));
        setCheatDayOptions(cheatOptions.map((option) => option.cheatDayOption));
        setSpecialPlaces(places.map((place) => place.specialPlace));
        setBrandProductMap(brandMap);
        setSelectedBrands(Object.keys(brandMap));
      } catch (error) {
        console.error("Error fetching data from Contentful:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      product =
        commonProducts[Math.floor(Math.random() * commonProducts.length)];
    }

    if (cheatDayEnabled) {
      const pool = [...commonProducts, ...cheatDayOptions];
      const weights = [
        ...commonProducts.map(() => 1),
        ...cheatDayOptions.map(() => 1.3),
      ];
      product = weightedRandom(pool, weights);
    } else if (specialPlaceEnabled) {
      const pool = [...commonProducts, ...specialPlaces];
      const weights = [
        ...commonProducts.map(() => 1),
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

  if (loading) {
    return <p>Ładowanie danych...</p>;
  }

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
