import React, { createContext, useContext, useEffect, useState } from "react";
import client from "./contentfulClient";

const ContentfulContext = createContext();

export const ContentfulProvider = ({ children }) => {
  const [commonProducts, setCommonProducts] = useState([]);
  const [cheatDayOptions, setCheatDayOptions] = useState([]);
  const [specialPlaces, setSpecialPlaces] = useState([]);
  const [predefinedStores, setPredefinedStores] = useState([]); // Dodajemy stan dla Predefined Stores
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pobieranie danych dla Predefined Stores
        const predefinedStoresResponse = await client.getEntries({
          content_type: "predefinedStores", // Upewnij się, że nazwa content_type jest poprawna
        });

        setPredefinedStores(
          predefinedStoresResponse.items.map((item) => item.fields.storeName)
        );

        // Możesz dodać inne dane tutaj, jeśli będą potrzebne w przyszłości
      } catch (error) {
        console.error("Error fetching data from Contentful:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ContentfulContext.Provider
      value={{
        predefinedStores, // Udostępniamy Predefined Stores w kontekście
        loading,
      }}
    >
      {children}
    </ContentfulContext.Provider>
  );
};

export const useContentful = () => useContext(ContentfulContext);
