import React, { createContext, useContext, useEffect, useState } from "react";
import client from "./contentfulClient";

const ContentfulContext = createContext();

export const ContentfulProvider = ({ children }) => {
  const [commonProducts, setCommonProducts] = useState([]);
  const [cheatDayOptions, setCheatDayOptions] = useState([]);
  const [specialPlaces, setSpecialPlaces] = useState([]);
  const [predefinedStores, setPredefinedStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const predefinedStoresResponse = await client.getEntries({
          content_type: "predefinedStores",
        });

        setPredefinedStores(
          predefinedStoresResponse.items.map((item) => item.fields.storeName)
        );

        const commonProductsResponse = await client.getEntries({
          content_type: "commonProducts",
        });

        setCommonProducts(
          commonProductsResponse.items.map((item) => item.fields.product)
        );

        const cheatDayOptionsResponse = await client.getEntries({
          content_type: "cheatDayOptions",
        });

        setCheatDayOptions(
          cheatDayOptionsResponse.items.map(
            (item) => item.fields.cheatDayOption
          )
        );

        const specialPlacesResponse = await client.getEntries({
          content_type: "specialPlaces",
        });

        setSpecialPlaces(
          specialPlacesResponse.items.map((item) => item.fields.specialPlace)
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
        commonProducts,
        cheatDayOptions,
        specialPlaces,
        loading,
      }}
    >
      {children}
    </ContentfulContext.Provider>
  );
};

export const useContentful = () => useContext(ContentfulContext);
