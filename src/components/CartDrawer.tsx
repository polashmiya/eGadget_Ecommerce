import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, getCartItemsCount } = useAppContext();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;  // Enhanced quantity update with animation feedback
  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    updateCartQuantity(itemId, newQuantity);
    setTimeout(() => {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 300);
  };

  // Enhanced remove with animation feedback
  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    setTimeout(() => {
      removeFromCart(itemId);
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 200);
  };

  // Handle escape key press and smooth animations
  useEffect(() => {
    let animationTimeout: ReturnType<typeof setTimeout>;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsClosing(true);
        setTimeout(() => {
          onClose();
          setIsClosing(false);
        }, 250);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
      setIsAnimating(true); // <-- Ensure animating is true on open
      animationTimeout = setTimeout(() => setIsAnimating(false), 500); // match drawer-spring-enter duration
    } else {
      document.body.style.overflow = 'unset';
      setIsAnimating(false);
      setIsClosing(false);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      if (animationTimeout) clearTimeout(animationTimeout);
    };
  }, [isOpen, onClose]);  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Enhanced Backdrop with better animation */}
      <div 
        className={`fixed inset-0 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-sm transition-all duration-500 ease-out ${
          isOpen && !isClosing ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />      {/* Enhanced Drawer with spring animation */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-all duration-500 ease-out
          ${isOpen && !isClosing ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
        style={{ willChange: 'transform,opacity', backfaceVisibility: 'hidden' }}
      >
        <div className="flex h-full flex-col">{/* Header */}
          <div className="flex items-center justify-between border-b p-4 bg-white">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span>Shopping Cart ({getCartItemsCount()})</span>
              {isAnimating && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
            </h2>            <button
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  onClose();
                  setIsClosing(false);
                }, 250);
              }}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-200 ease-in-out group"
            >
              <svg className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>{/* Cart Items */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {cart.length === 0 ? (
              <div className={`flex h-full flex-col items-center justify-center p-8 text-center transition-opacity duration-500 ${
                isOpen ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="animate-pulse">
                  <svg
                    className="h-16 w-16 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-4">Add some items to get started!</p>
                <Link
                  to="/products"
                  onClick={onClose}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {cart.map((item, index) => (                  <div 
                    key={item.id} 
                    className={`cart-item-hover flex items-start space-x-3 p-3 border rounded-lg bg-white transition-all duration-200 ease-in-out ${
                      updatingItems.has(item.id) ? 'gentle-pulse' : ''
                    } ${
                      isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                    style={{
                      transitionDelay: `${index * 50}ms`
                    }}
                  >{/* Product Image */}
                    <Link
                      to={`/product/${item.product.id}`}
                      onClick={onClose}
                      className="flex-shrink-0 group"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg border transition-transform duration-200 group-hover:scale-105"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product.id}`}
                        onClick={onClose}
                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 block truncate"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-600">${item.product.price.toFixed(2)} each</p>
                        {/* Quantity Controls */}                      <div className="flex items-center mt-2 space-x-2">
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                          className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all duration-150 ease-in-out hover:scale-110"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className={`px-2 py-1 border rounded text-sm min-w-[2rem] text-center transition-all duration-200 ${
                          updatingItems.has(item.id) ? 'scale-110 bg-blue-50 border-blue-200' : 'bg-gray-50'
                        }`}>
                          {updatingItems.has(item.id) ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mx-auto"></div>
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stockQuantity || updatingItems.has(item.id)}
                          className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all duration-150 ease-in-out hover:scale-110"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className="flex flex-col items-end space-y-2">
                      <div className={`font-medium text-gray-900 transition-all duration-200 ${
                        isAnimating ? 'scale-105 text-blue-600' : ''
                      }`}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={updatingItems.has(item.id)}
                        className="text-red-600 hover:text-red-700 p-1 rounded transition-all duration-200 ease-in-out hover:bg-red-50 hover:scale-110 disabled:opacity-50"
                        title="Remove from cart"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>          {/* Footer with Totals and Checkout */}
          {cart.length > 0 && (
            <div className={`border-t p-4 space-y-4 bg-gray-50 transition-all duration-300 ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Free Shipping Banner */}
              {shipping > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center animate-pulse">
                  <p className="text-sm text-blue-800 font-medium">
                    🚚 Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 ease-in-out transform hover:scale-105 text-center block"
                >
                  View Full Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 text-center block shadow-lg"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
