import { useEffect, useRef } from 'react';

export function useScrollPosition(dependency?: string | number | object) {
  const scrollPositionRef = useRef<number>(0);
  const isFirstRender = useRef(true);
  const previousDependency = useRef(dependency);

  useEffect(() => {
    // On first render, don't interfere with scroll
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousDependency.current = dependency;
      return;
    }

    // If dependency changed (filters changed), save current position
    if (previousDependency.current !== dependency) {
      scrollPositionRef.current = window.scrollY;
      previousDependency.current = dependency;
    }
  }, [dependency]);

  useEffect(() => {
    // Only restore scroll position if we're on the same route and filters changed
    const timer = setTimeout(() => {
      if (scrollPositionRef.current > 0 && !isFirstRender.current) {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: 'instant'
        });
      }
    }, 50); // Small delay to ensure content is rendered

    return () => clearTimeout(timer);
  }, [dependency]);

  return {
    saveScrollPosition: () => {
      scrollPositionRef.current = window.scrollY;
    },
    restoreScrollPosition: () => {
      if (scrollPositionRef.current > 0) {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: 'smooth'
        });
      }
    },
    scrollToTop: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
}
