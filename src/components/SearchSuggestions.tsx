import { sampleProducts } from '../data/products';
import type { Product } from '../types';

interface SearchSuggestionsProps {
  readonly query: string;
  readonly isVisible: boolean;
  readonly onSuggestionClick: (suggestion: string) => void;
  readonly onClose: () => void;
}

export function SearchSuggestions({ query, isVisible, onSuggestionClick, onClose }: SearchSuggestionsProps) {
  if (!isVisible || !query.trim()) {
    return null;
  }

  // Generate suggestions based on the search query
  const generateSuggestions = (searchQuery: string): string[] => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const suggestions = new Set<string>();

    // Search through products and collect relevant suggestions
    sampleProducts.forEach((product: Product) => {      const productName = product.name.toLowerCase();
      const productBrand = product.brand.toLowerCase();
      const productCategory = product.category.toLowerCase();
      const productSubcategory = product.subcategory?.toLowerCase() ?? '';
      const productDescription = product.description.toLowerCase();

      // Add product name if it matches
      if (productName.includes(normalizedQuery)) {
        suggestions.add(product.name);
      }

      // Add brand suggestions
      if (productBrand.includes(normalizedQuery)) {
        suggestions.add(product.brand);
      }

      // Add category suggestions
      if (productCategory.includes(normalizedQuery)) {
        suggestions.add(product.category);
      }

      // Add subcategory suggestions
      if (productSubcategory && productSubcategory.includes(normalizedQuery)) {
        suggestions.add(product.subcategory!);
      }

      // Add partial word matches from product names
      const words = productName.split(' ');
      words.forEach(word => {
        if (word.includes(normalizedQuery) && word.length > 2) {
          suggestions.add(product.name);
        }
      });

      // Add description-based suggestions (for key features)
      if (productDescription.includes(normalizedQuery)) {
        // Extract key terms from description
        const descWords = productDescription.split(' ');
        descWords.forEach(word => {
          if (word.includes(normalizedQuery) && word.length > 3) {
            suggestions.add(product.name);
          }
        });
      }
    });

    // Convert to array and limit to 8 suggestions
    return Array.from(suggestions).slice(0, 8);
  };

  const suggestions = generateSuggestions(query);

  if (suggestions.length === 0) {
    return null;
  }
  return (
    <>
      {/* Backdrop to close suggestions when clicking outside */}
      <button 
        type="button"
        className="fixed inset-0 z-40 cursor-default" 
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        aria-label="Close search suggestions"
      />
      
      {/* Suggestions dropdown */}
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
        <div className="py-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center space-x-3"
            >
              <svg 
                className="h-4 w-4 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <span className="text-sm text-gray-700 hover:text-blue-600">
                {suggestion}
              </span>
            </button>
          ))}
        </div>
        
        {/* Footer with suggestion count */}
        <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 text-xs text-gray-500">
          {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} found
        </div>
      </div>
    </>
  );
}
