export const setSessionStorageItem = (key, value, isJson = false) => {
  let newValue = isJson ? JSON.stringify(value) : value;
  try {
    window.sessionStorage.setItem(key, newValue);
  } catch (error) {
    window.console.error(error);
  }
};

export const getSessionStorageItem = (key, isJson = false) => {
  try {
    const item = window.sessionStorage.getItem(key);
    if (item === null) return undefined;
    let newItem = isJson ? JSON.parse(item) : item;
    return newItem;
  } catch (error) {
    window.console.error(error);
    return undefined;
  }
};

export const removeSessionStorageItem = (key) => {
  try {
    window.sessionStorage.removeItem(key);
  } catch (error) {
    window.console.error(error);
  }
};
