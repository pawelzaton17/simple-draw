import { useState, useEffect } from "react";
import { fetchBrandProductMap } from "../api/contentfulClient";

const useFetchBrandProducts = () => {
  const [brandProductMap, setBrandProductMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandMap = await fetchBrandProductMap();
        setBrandProductMap(brandMap);
      } catch (err) {
        console.error("Error fetching brand products:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { brandProductMap, loading, error };
};

export default useFetchBrandProducts;
