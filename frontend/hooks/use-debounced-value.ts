import { useEffect, useState } from "react";

export const useDebouncedValue = (query: string, delay = 1000) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  useEffect(() => {
    const to = setTimeout(() => {
      setDebouncedValue(query);
    }, delay);
    return () => clearTimeout(to);
  }, [query]);
  return debouncedValue;
};
