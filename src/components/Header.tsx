import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { categories } from '../data/products';
import { SearchSuggestions } from './SearchSuggestions';
import { CartDrawer } from './CartDrawer';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user, isAuthenticated, logout, getCartItemsCount, isCartDrawerOpen, toggleCartDrawer, closeCartDrawer } = useApp();const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      // Don't clear search query so user can see what they searched for
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const clearSearchAndNavigate = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const cartItemsCount = getCartItemsCount();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="bg-white dark:bg-dark-bg shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">eG</span>
            </div>
            <span className="text-xl font-bold text-gray-900">eGadget</span>
          </Link>          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Search
                </button>
                
                {/* Search Suggestions */}
                <SearchSuggestions
                  query={searchQuery}
                  isVisible={showSuggestions}
                  onSuggestionClick={handleSuggestionClick}
                  onClose={handleCloseSuggestions}
                />
              </div>
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className="p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.22a1 1 0 011.42 1.42l-.7.7a1 1 0 11-1.42-1.42l.7-.7zM18 9a1 1 0 100 2h-1a1 1 0 100-2h1zm-2.22 6.78a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-6.22-1.22a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7zM4 11a1 1 0 100-2H3a1 1 0 100 2h1zm2.22-6.78a1 1 0 00-1.42-1.42l-.7.7a1 1 0 001.42 1.42l.7-.7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-700 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="relative group">                  <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm">{user?.firstName}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    to="/register"
                    className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>            {/* Cart */}
            <button
              onClick={toggleCartDrawer}
              className="relative flex items-center text-gray-700 hover:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7m-7 0v-4m7 4v-4" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>        {/* Navigation - Desktop */}
        <nav className="hidden md:flex space-x-8 py-3 border-t">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium" onClick={clearSearchAndNavigate}>
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium" onClick={clearSearchAndNavigate}>
            All Products
          </Link>
          
          {/* Category Dropdowns */}
          {categories.map((category) => (
            <div
              key={category.name}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(category.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >              <Link 
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1"
                onClick={() => {
                  setActiveDropdown(null);
                  clearSearchAndNavigate();
                }}
              >
                <span>{category.name}</span>
                <svg 
                  className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              
              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border z-50 overflow-hidden transition-all duration-400 ${
                  activeDropdown === category.name
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2'
                }`}
                style={{
                  maxHeight: activeDropdown === category.name ? '500px' : '0px',
                  transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)'
                }}
              >
                <div className="py-2">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory}
                      to={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory)}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={() => {
                        setActiveDropdown(null);
                        clearSearchAndNavigate();
                      }}
                    >
                      {subcategory}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-3">            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                {/* Mobile Search Suggestions */}
                <SearchSuggestions
                  query={searchQuery}
                  isVisible={showSuggestions && isMobileMenuOpen}
                  onSuggestionClick={(suggestion) => {
                    handleSuggestionClick(suggestion);
                    setIsMobileMenuOpen(false);
                  }}
                  onClose={handleCloseSuggestions}
                />
              </div>
            </form>{/* Mobile Navigation */}
            <div className="space-y-2">
              <Link
                to="/"
                className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  clearSearchAndNavigate();
                }}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  clearSearchAndNavigate();
                }}
              >
                All Products
              </Link>
                {/* Mobile Category Menu */}
              {categories.map((category) => (
                <div key={category.name} className="space-y-1">                  <Link
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    className="block text-gray-900 font-semibold py-2 border-b border-gray-100 hover:text-blue-600 transition-colors"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      clearSearchAndNavigate();
                    }}
                  >
                    {category.name}
                  </Link>
                  {category.subcategories.map((subcategory) => (                    <Link
                      key={subcategory}
                      to={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory)}`}
                      className="block text-gray-600 hover:text-blue-600 py-1 pl-4"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        clearSearchAndNavigate();
                      }}
                    >
                      {subcategory}
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Mobile User Menu */}
            <div className="border-t pt-3">
              {isAuthenticated ? (
                <div className="space-y-2">                  <div className="flex items-center space-x-2 text-gray-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">{user?.firstName}</span>
                  </div>                  <Link
                    to="/profile"
                    className="block text-gray-700 hover:text-blue-600 py-1"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      clearSearchAndNavigate();
                    }}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block text-gray-700 hover:text-blue-600 py-1"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      clearSearchAndNavigate();
                    }}
                  >
                    Orders
                  </Link>                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                      clearSearchAndNavigate();
                    }}
                    className="block text-gray-700 hover:text-blue-600 py-1"
                  >
                    Logout
                  </button>
                </div>
              ) : (                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-blue-600 font-medium py-1"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      clearSearchAndNavigate();
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-gray-700 hover:text-blue-600 font-medium py-1"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      clearSearchAndNavigate();
                    }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartDrawerOpen} 
        onClose={closeCartDrawer} 
      />
    </header>
  );
}
