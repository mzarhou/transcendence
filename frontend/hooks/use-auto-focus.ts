import { Ref, useEffect, useRef } from "react";

export function useAutoFocus<T>() {
  const ref: Ref<HTMLInputElement> = useRef(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return ref;
}
