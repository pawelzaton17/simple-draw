import React, { createContext, useContext, useEffect, useState } from "react";
import client from "./contentfulClient";

const ContentfulContext = createContext();

export const ContentfulProvider = ({ children }) => {
  const [commonProducts, setCommonProducts] = useState([]);
  const [cheatDayOptions, setCheatDayOptions] = useState([]);
  const [specialPlaces, setSpecialPlaces] = useState([]);
  const [predefinedStores, setPredefinedStores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const predefinedStoresResponse = await client.getEntries({
          content_type: "predefinedStores",
        });

        setPredefinedStores(
          predefinedStoresResponse.items.map((item) => item.fields.storeName)
        );
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
        predefinedStores,
        loading,
      }}
    >
      {children}
    </ContentfulContext.Provider>
  );
};

export const useContentful = () => useContext(ContentfulContext);
