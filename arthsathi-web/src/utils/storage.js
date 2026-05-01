// storage.js - Simple helpers for local storage

// save data to local storage
export const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// get data from local storage, return empty array if no data found
export const getData = (key) => {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error parsing data from localStorage", error);
    return [];
  }
};
