import { useState, useEffect, useMemo } from "react";
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

  const audio = useMemo(() => {
    const sound = new Audio(winSound);
    sound.volume = 0.1;
    return sound;
  }, []);

  // Load history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem("drawHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("drawHistory", JSON.stringify(history));
  }, [history]);

  // Fetch data from Contentful
  useEffect(() => {
    const fetchData = async () => {
      try {
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

        const results = await Promise.all(
          dataFetchers.map(async ({ fetcher, mapper }) => {
            const data = await fetcher();
            return data.map(mapper);
          })
        );

        const [stores, products, cheatOptions, places] = results;

        setPredefinedStores(stores);
        setCommonProducts(products);
        setCheatDayOptions(cheatOptions);
        setSpecialPlaces(places);

        const brandMap = await fetchBrandProductMap();
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

  // Helper functions
  const getRandomItem = (array) =>
    array[Math.floor(Math.random() * array.length)];

  const handleAdvancedDraw = () => {
    const selectedBrand = getRandomItem(selectedBrands);
    const brandProducts = brandProductMap[selectedBrand];
    const selectedBrandProduct = getRandomItem(brandProducts);
    return `${selectedBrand} — ${selectedBrandProduct}`;
  };

  const handleCheatDayDraw = () => {
    const pool = [...commonProducts, ...cheatDayOptions];
    const weights = [
      ...commonProducts.map(() => 1),
      ...cheatDayOptions.map(() => 1.3),
    ];
    return weightedRandom(pool, weights);
  };

  const handleSpecialPlaceDraw = () => {
    const pool = [...commonProducts, ...specialPlaces];
    const weights = [
      ...commonProducts.map(() => 1),
      ...specialPlaces.map(() => 1.3),
    ];
    return weightedRandom(pool, weights);
  };

  const finalizeDraw = (product) => {
    const timestamp = new Date().toLocaleString();
    setSelectedProduct(product);
    setHistory([{ product, timestamp }, ...history]);
    setShowConfetti(true);

    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.error("Error playing audio:", err);
    });

    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleDraw = () => {
    if (isAdvancedDraw) {
      const product = handleAdvancedDraw();
      finalizeDraw(product);
      return;
    }

    if (!selectedStore) return;

    let product = getRandomItem(commonProducts);

    if (cheatDayEnabled) {
      product = handleCheatDayDraw();
    } else if (specialPlaceEnabled) {
      product = handleSpecialPlaceDraw();
    }

    finalizeDraw(product);
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
