import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product, User } from '../types/index';

interface AppState {
  cart: CartItem[];
  user: User | null;
  isAuthenticated: boolean;
  isCartDrawerOpen: boolean;
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' }
  | { type: 'OPEN_CART_DRAWER' }
  | { type: 'CLOSE_CART_DRAWER' }
  | { type: 'TOGGLE_CART_DRAWER' };

const initialState: AppState = {
  cart: [],
  user: null,
  isAuthenticated: false,
  isCartDrawerOpen: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.find(item => item.id === product.id);
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      
      return {
        ...state,
        cart: [...state.cart, { id: product.id, product, quantity }],
      };
    }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
      case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        cart: [],
        isCartDrawerOpen: false,
      };

    case 'OPEN_CART_DRAWER':
      return {
        ...state,
        isCartDrawerOpen: true,
      };

    case 'CLOSE_CART_DRAWER':
      return {
        ...state,
        isCartDrawerOpen: false,
      };

    case 'TOGGLE_CART_DRAWER':
      return {
        ...state,
        isCartDrawerOpen: !state.isCartDrawerOpen,
      };
    
    default:
      return state;
  }
}

interface AppContextType extends AppState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  login: (user: User) => void;
  logout: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToCart = (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: productId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const login = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };
  const getCartItemsCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  const openCartDrawer = () => {
    dispatch({ type: 'OPEN_CART_DRAWER' });
  };

  const closeCartDrawer = () => {
    dispatch({ type: 'CLOSE_CART_DRAWER' });
  };

  const toggleCartDrawer = () => {
    dispatch({ type: 'TOGGLE_CART_DRAWER' });
  };

  const value: AppContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    login,
    logout,
    getCartTotal,
    getCartItemsCount,
    openCartDrawer,
    closeCartDrawer,
    toggleCartDrawer,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
