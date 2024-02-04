







export const loadState = (reduxStateName) => {
    try {
      const serializedState = localStorage.getItem(reduxStateName);
      if (serializedState == null) {
        return null; 
      }
      let data = JSON.parse(serializedState);
      if(typeof data !== "object") throw new Error("Это не объект")
      return data
    } catch (error) {
      console.error(`Ошибка загрузки state (${reduxStateName}) localStorage:`, error);
      localStorage.removeItem(reduxStateName);
      return null;
    }
  };