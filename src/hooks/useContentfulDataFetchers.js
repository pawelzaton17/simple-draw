import { useState, useEffect } from "react";

const useContentfulDataFetchers = (dataFetchers) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.all(
          dataFetchers.map(async ({ key, fetcher, mapper }) => {
            const fetchedData = await fetcher();
            return { key, data: fetchedData.map(mapper) };
          })
        );

        const dataObject = results.reduce((acc, { key, data }) => {
          acc[key] = data;
          return acc;
        }, {});

        setData(dataObject);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataFetchers]);

  return { data, loading, error };
};

export default useContentfulDataFetchers;
