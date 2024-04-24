import { getStorageValue } from "@/lib/utils";
import { useState, useEffect } from "react";



export const useLocalStorage = (key:string, defaultValue:string) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

