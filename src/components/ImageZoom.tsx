import { useState, useRef, useEffect } from 'react';

interface ImageZoomProps {
  readonly src: string;
  readonly alt: string;
  readonly className?: string;
}

export function ImageZoom({ src, alt, className = '' }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleMouseEnter = () => {
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Close zoom on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomed(false);
      }
    };

    if (isZoomed) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isZoomed]);

  return (
    <>
      <div
        ref={containerRef}
        className={`relative cursor-zoom-in group ${className}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={toggleZoom}
      >
        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
        )}

        <img
          ref={imageRef}
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
        />
        
        {/* Zoom indicator */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          <span>Zoom</span>
        </div>

        {/* Desktop hover zoom preview */}
        {showZoom && !isZoomed && !isLoading && (
          <div className="hidden lg:block absolute top-4 left-4 w-40 h-40 border-2 border-white shadow-xl rounded-lg overflow-hidden pointer-events-none z-10">
            <div
              className="w-full h-full bg-white"
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: '400%',
                backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              Preview
            </div>
          </div>
        )}
      </div>

      {/* Full screen zoom modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 z-20 hover:scale-110"
              aria-label="Close zoom view"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Zoomed image container */}
            <div className="relative">
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[90vh] object-contain cursor-zoom-out rounded-lg shadow-2xl"
                onClick={() => setIsZoomed(false)}
              />
            </div>

            {/* Instructions */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg text-sm flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Click image or press ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
