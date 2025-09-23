import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Store scroll positions for different routes
const scrollPositions: { [key: string]: number } = {};

export function ScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const previousPath = sessionStorage.getItem('previousPath');
    
    // Save current scroll position before navigating away
    if (previousPath && previousPath !== currentPath) {
      scrollPositions[previousPath] = window.scrollY;
    }

    // Restore scroll position or scroll to top based on navigation type
    const timer = setTimeout(() => {
      const currentBasePath = location.pathname;
      const previousBasePath = previousPath?.split('?')[0];
      
      // For product detail pages, always scroll to top
      if (currentBasePath.startsWith('/product/')) {
        window.scrollTo(0, 0);
      }
      // For products page with filters, check if we have a stored position
      else if (currentBasePath === '/products' && scrollPositions[currentPath] !== undefined) {
        window.scrollTo(0, scrollPositions[currentPath]);
      }
      // If we're staying on the same products page (filtering), don't auto-scroll
      else if (previousBasePath === currentBasePath && currentBasePath === '/products') {
        // Let the useScrollPosition hook handle this
        return;
      }
      // For other page navigations, scroll to top
      else if (previousBasePath !== currentBasePath) {
        window.scrollTo(0, 0);
      }
    }, 0);

    // Store current path for next navigation
    sessionStorage.setItem('previousPath', currentPath);

    return () => clearTimeout(timer);
  }, [location]);

  return null;
}
