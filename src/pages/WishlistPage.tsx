import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { user, addToCart } = useAppContext();
  
  // Mock wishlist data - in a real app, this would come from context or API
  const [wishlistItems, setWishlistItems] = useState<Product[]>([    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      category: 'Electronics',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
      ],
      description: 'High-quality wireless headphones with noise cancellation and long battery life. Perfect for music lovers and professionals.',
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      stockQuantity: 50,
      brand: 'TechSound',
      specifications: {
        'Battery Life': '30 hours',
        'Connectivity': 'Bluetooth 5.0',
        'Weight': '250g',
        'Noise Cancellation': 'Active'
      },
      tags: ['wireless', 'bluetooth', 'noise-cancelling']
    },    {
      id: '3',
      name: 'Running Shoes',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      category: 'Footwear',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500'
      ],
      description: 'Lightweight and comfortable running shoes designed for performance and durability.',
      rating: 4.7,
      reviewCount: 203,
      inStock: true,
      stockQuantity: 25,
      brand: 'RunFast',
      specifications: {
        'Material': 'Mesh and synthetic',
        'Sole': 'Rubber',
        'Weight': '280g',
        'Sizes': '6-13'
      },
      tags: ['running', 'athletic', 'lightweight']
    },    {
      id: '5',
      name: 'Vintage Leather Jacket',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
      category: 'Fashion',
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500'
      ],
      description: 'Classic vintage-style leather jacket made from genuine leather with a comfortable fit.',
      rating: 4.6,
      reviewCount: 89,
      inStock: false,
      stockQuantity: 0,
      brand: 'StyleCraft',
      specifications: {
        'Material': '100% Genuine Leather',
        'Lining': 'Polyester',
        'Closure': 'Zipper',
        'Care': 'Professional leather cleaning'
      },
      tags: ['leather', 'vintage', 'fashion']
    }
  ]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to view your wishlist.</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(item => {
      if (item.inStock) {
        handleAddToCart(item);
      }
    });
    setWishlistItems(prev => prev.filter(item => !item.inStock));
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      setWishlistItems([]);
    }
  };

  const inStockCount = wishlistItems.filter(item => item.inStock).length;
  const outOfStockCount = wishlistItems.filter(item => !item.inStock).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
              {inStockCount > 0 && outOfStockCount > 0 && (
                <span> • {inStockCount} in stock, {outOfStockCount} out of stock</span>
              )}
            </p>
          </div>
          
          {wishlistItems.length > 0 && (
            <div className="flex space-x-3">
              {inStockCount > 0 && (
                <button
                  onClick={handleMoveAllToCart}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add All to Cart ({inStockCount})
                </button>
              )}
              <button
                onClick={handleClearWishlist}
                className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
              >
                Clear Wishlist
              </button>
            </div>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">
                Start browsing our products and save your favorites by clicking the heart icon.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* In Stock Items */}
            {inStockCount > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">In Stock ({inStockCount})</h2>
                  <button
                    onClick={handleMoveAllToCart}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Add all to cart
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {wishlistItems
                    .filter(item => item.inStock)
                    .map((product) => (
                      <div key={product.id} className="relative">
                        <ProductCard product={product} />
                        <button
                          onClick={() => handleRemoveFromWishlist(product.id)}
                          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 z-10"
                          title="Remove from wishlist"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Out of Stock Items */}
            {outOfStockCount > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Out of Stock ({outOfStockCount})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {wishlistItems
                    .filter(item => !item.inStock)
                    .map((product) => (
                      <div key={product.id} className="relative opacity-75">
                        <ProductCard product={product} />
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-10 rounded-lg flex items-center justify-center">
                          <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFromWishlist(product.id)}
                          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 z-10"
                          title="Remove from wishlist"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="mt-12 border-t pt-8">
              <h2 className="text-xl font-semibold mb-4">You might also like</h2>
              <p className="text-gray-600 mb-6">
                Based on items in your wishlist, we think you'll love these products too.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {/* This would normally show recommended products */}
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-500">Recommended products would appear here</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-500">Recommended products would appear here</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-500">Recommended products would appear here</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-500">Recommended products would appear here</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
