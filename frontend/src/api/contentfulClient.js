import { createClient } from "contentful";

const client = createClient({
  space: process.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: process.env.VITE_CONTENTFUL_ACCESS_TOKEN,
});

export const fetchEntries = async (contentType) => {
  try {
    const entries = await client.getEntries({ content_type: contentType });
    return entries.items.map((item) => item.fields);
  } catch (error) {
    console.error(`Error fetching entries for ${contentType}:`, error);
    return [];
  }
};

// Brand Products
export const fetchBrandProductMap = async () => {
  try {
    const entries = await client.getEntries({ content_type: "brandProducts" });
    const brandMap = {};
    entries.items.forEach((item) => {
      const { brandName, products } = item.fields;
      brandMap[brandName] = products;
    });
    return brandMap;
  } catch (error) {
    console.error("Error fetching brand product map:", error);
    return {};
  }
};

// Special Places
export const fetchSpecialPlaces = async () => {
  try {
    const entries = await client.getEntries({ content_type: "specialPlaces" });
    return entries.items.map((item) => item.fields.specialPlace);
  } catch (error) {
    console.error("Error fetching special places:", error);
    return [];
  }
};

// Cheat Day Options
export const fetchCheatDayOptions = async () => {
  try {
    const entries = await client.getEntries({
      content_type: "cheatDayOptions",
    });
    return entries.items.map((item) => item.fields.cheatDayOption);
  } catch (error) {
    console.error("Error fetching cheat day options:", error);
    return [];
  }
};

export default client;
