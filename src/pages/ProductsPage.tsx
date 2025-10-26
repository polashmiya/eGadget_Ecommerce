import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { sampleProducts, categories, brands } from '../data/products';
import { useScrollPosition } from '../hooks/useScrollPosition';
import type { SearchFilters } from '../types';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subcategory: true,
    brand: true,
    price: true,
    rating: true,
  });

  // Use scroll position hook to maintain scroll when filters change
  const { saveScrollPosition } = useScrollPosition(searchParams.toString());

  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get('category') ?? '',
    subcategory: searchParams.get('subcategory') ?? '',
    brand: searchParams.get('brand') ?? '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    sortBy: (searchParams.get('sortBy') as SearchFilters['sortBy']) ?? 'name',
    sortOrder: (searchParams.get('sortOrder') as SearchFilters['sortOrder']) ?? 'asc',
  });
  // Sync URL parameters with filters state when URL changes
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') ?? '',
      subcategory: searchParams.get('subcategory') ?? '',
      brand: searchParams.get('brand') ?? '',
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
      sortBy: (searchParams.get('sortBy') as SearchFilters['sortBy']) ?? 'name',
      sortOrder: (searchParams.get('sortOrder') as SearchFilters['sortOrder']) ?? 'asc',
    });
  }, [searchParams]);

  const searchQuery = searchParams.get('q') ?? '';

  const filteredProducts = useMemo(() => {
    let filtered = [...sampleProducts];

    // Search by name or description
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Filter by subcategory
    if (filters.subcategory) {
      filtered = filtered.filter(product => product.subcategory === filters.subcategory);
    }

    // Filter by brand
    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    // Filter by rating
    if (filters.minRating !== undefined) {
      filtered = filtered.filter(product => product.rating >= filters.minRating!);
    }

    // Sort products
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'newest':
          break;
        default:
          break;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [searchQuery, filters]);  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    // Save current scroll position before applying filters
    saveScrollPosition();
    
    let updated = { ...filters, ...newFilters };
    
    // If category changes, clear subcategory if it doesn't exist in new category
    if (newFilters.category !== undefined && newFilters.category !== filters.category) {
      const selectedCategory = categories.find(cat => cat.name === newFilters.category);
      if (!selectedCategory?.subcategories?.includes(filters.subcategory ?? '')) {
        updated = { ...updated, subcategory: '' };
      }
    }
    
    setFilters(updated);
      const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (updated.category) params.set('category', updated.category);
    if (updated.subcategory) params.set('subcategory', updated.subcategory);
    if (updated.brand) params.set('brand', updated.brand);
    if (updated.minPrice) params.set('minPrice', updated.minPrice.toString());
    if (updated.maxPrice) params.set('maxPrice', updated.maxPrice.toString());
    if (updated.minRating) params.set('minRating', updated.minRating.toString());
    if (updated.sortBy) params.set('sortBy', updated.sortBy);
    if (updated.sortOrder) params.set('sortOrder', updated.sortOrder);
    
    setSearchParams(params);
  };  const clearFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      brand: '',
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      sortBy: 'name',
      sortOrder: 'asc',
    });
    setSearchParams({});
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: Infinity },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <div className="flex gap-2 items-center">
                  {/* Expand All */}
                  <span
                    onClick={() => setExpandedSections({ category: true, subcategory: true, brand: true, price: true, rating: true })}
                    className="cursor-pointer p-1 rounded hover:bg-blue-100 text-blue-600"
                    title="Expand all filters"
                    role="button"
                    tabIndex={0}
                    aria-label="Expand all filters"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
                    </svg>
                  </span>
                  {/* Collapse All */}
                  <span
                    onClick={() => setExpandedSections({ category: false, subcategory: false, brand: false, price: false, rating: false })}
                    className="cursor-pointer p-1 rounded hover:bg-gray-100 text-gray-600"
                    title="Collapse all filters"
                    role="button"
                    tabIndex={0}
                    aria-label="Collapse all filters"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5" />
                    </svg>
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 ml-2"
                  >
                    Clear All
                  </button>
                </div>
              </div>              {/* Category Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('category')}
                  className="flex items-center justify-between w-full text-left font-medium mb-3 hover:text-blue-600"
                >
                  <span>Category</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.category && (
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={!filters.category}
                        onChange={() => updateFilters({ category: '' })}
                        className="mr-2"
                      />
                      All Categories
                    </label>                    {categories.map(category => (
                      <label key={category.name} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.name}
                          checked={filters.category === category.name}
                          onChange={() => updateFilters({ category: category.name })}
                          className="mr-2"
                        />
                        {category.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>              {/* Subcategory Filter */}
              {filters.category && (
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('subcategory')}
                    className="flex items-center justify-between w-full text-left font-medium mb-3 hover:text-blue-600"
                  >
                    <span>Subcategory</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedSections.subcategory ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.subcategory && (
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="subcategory"
                          value=""
                          checked={!filters.subcategory}
                          onChange={() => updateFilters({ subcategory: '' })}
                          className="mr-2"
                        />
                        All Subcategories
                      </label>
                      {categories
                        .find(cat => cat.name === filters.category)
                        ?.subcategories.map(subcategory => (
                          <label key={subcategory} className="flex items-center">
                            <input
                              type="radio"
                              name="subcategory"
                              value={subcategory}
                              checked={filters.subcategory === subcategory}
                              onChange={() => updateFilters({ subcategory })}
                              className="mr-2"
                            />
                            {subcategory}
                          </label>
                        ))}
                    </div>
                  )}
                </div>
              )}              {/* Brand Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('brand')}
                  className="flex items-center justify-between w-full text-left font-medium mb-3 hover:text-blue-600"
                >
                  <span>Brand</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedSections.brand ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.brand && (
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        value=""
                        checked={!filters.brand}
                        onChange={() => updateFilters({ brand: '' })}
                        className="mr-2"
                      />
                      All Brands
                    </label>
                    {brands.map(brand => (
                      <label key={brand} className="flex items-center">
                        <input
                          type="radio"
                          name="brand"
                          value={brand}
                          checked={filters.brand === brand}
                          onChange={() => updateFilters({ brand })}
                          className="mr-2"
                        />
                        {brand}
                      </label>
                    ))}
                  </div>
                )}
              </div>              {/* Price Range Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full text-left font-medium mb-3 hover:text-blue-600"
                >
                  <span>Price Range</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.price && (
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={!filters.minPrice && !filters.maxPrice}
                        onChange={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
                        className="mr-2"
                      />
                      Any Price
                    </label>
                    {priceRanges.map(range => (
                      <label key={range.label} className="flex items-center">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                          onChange={() => updateFilters({ 
                            minPrice: range.min, 
                            maxPrice: range.max === Infinity ? undefined : range.max 
                          })}
                          className="mr-2"
                        />
                        {range.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>              {/* Rating Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('rating')}
                  className="flex items-center justify-between w-full text-left font-medium mb-3 hover:text-blue-600"
                >
                  <span>Minimum Rating</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.rating && (
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.minRating === rating}
                          onChange={() => updateFilters({ minRating: rating })}
                          className="mr-2"
                        />
                        {rating}+ Stars
                      </label>
                    ))}
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={!filters.minRating}
                        onChange={() => updateFilters({ minRating: undefined })}
                        className="mr-2"
                      />
                      All Ratings
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span>Filters</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">View:</span>
                    <button
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                      className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200' : 'text-gray-400 hover:text-gray-600'}`}
                      tabIndex={0}
                      type="button"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                      className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200' : 'text-gray-400 hover:text-gray-600'}`}
                      tabIndex={0}
                      type="button"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    <select
                      value={`${filters.sortBy}-${filters.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-');
                        updateFilters({ 
                          sortBy: sortBy as SearchFilters['sortBy'], 
                          sortOrder: sortOrder as SearchFilters['sortOrder'] 
                        });
                      }}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="price-asc">Price (Low to High)</option>
                      <option value="price-desc">Price (High to Low)</option>
                      <option value="rating-desc">Rating (High to Low)</option>
                      <option value="newest-desc">Newest First</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-x-8 gap-y-8 px-2 sm:px-0 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    className={viewMode === 'list' ? 'flex' : ''}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-9 7h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
