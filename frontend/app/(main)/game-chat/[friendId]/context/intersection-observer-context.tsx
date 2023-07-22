"use client";

import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ROOT_EL_ID } from "../hooks/use-message-intersection-callback";

const IntersectionObserverContext = createContext<IntersectionObserver | null>(
  null
);

const useIntersectionObserver = () => useContext(IntersectionObserverContext);

const IntersectionObserverProvider: FC<{
  children: ReactNode;
  callback: IntersectionObserverCallback;
}> = ({ children, callback }) => {
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: document.getElementById(ROOT_EL_ID),
      threshold: 1.0, // 100% of the message element should be visible
    };
    setObserver(new IntersectionObserver(callback, options));
  }, []);

  return (
    <IntersectionObserverContext.Provider value={observer}>
      {children}
    </IntersectionObserverContext.Provider>
  );
};

export { useIntersectionObserver, IntersectionObserverProvider };
