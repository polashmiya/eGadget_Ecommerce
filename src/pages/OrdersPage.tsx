import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Order } from '../types';
import { motion } from 'framer-motion';

export function OrdersPage() {
  const { user } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: 'ORD-001',
      userId: user?.id ?? '1',
      items: [
        {
          id: '1',
          product: {
            id: '1',
            name: 'Premium Wireless Headphones',
            price: 199.99,
            description: 'High-quality wireless headphones with noise cancellation',
            image: 'https://via.placeholder.com/100x100',
            category: 'Electronics',
            brand: 'AudioTech',
            rating: 4.8,
            reviewCount: 150,
            inStock: true,
            stockQuantity: 25,
          },
          quantity: 1,
        },
        {
          id: '2',
          product: {
            id: '2',
            name: 'Smart Fitness Watch',
            price: 299.99,
            description: 'Advanced fitness tracking watch with heart rate monitor',
            image: 'https://via.placeholder.com/100x100',
            category: 'Electronics',
            brand: 'FitTech',
            rating: 4.6,
            reviewCount: 89,
            inStock: true,
            stockQuantity: 15,
          },
          quantity: 1,
        },
      ],
      total: 499.98,
      subtotal: 499.98,
      tax: 0,
      shipping: 0,
      status: 'delivered',
      shippingAddress: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        address2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
      },
      billingAddress: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        address2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
      },
      paymentMethod: 'Credit Card ending in 1234',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: 'ORD-002',
      userId: user?.id ?? '1',
      items: [
        {
          id: '3',
          product: {
            id: '3',
            name: 'Organic Cotton T-Shirt',
            price: 29.99,
            description: 'Comfortable organic cotton t-shirt',
            image: 'https://via.placeholder.com/100x100',
            category: 'Clothing',
            brand: 'EcoWear',
            rating: 4.4,
            reviewCount: 67,
            inStock: true,
            stockQuantity: 50,
          },
          quantity: 2,
        },
      ],
      total: 59.98,
      subtotal: 59.98,
      tax: 0,
      shipping: 0,
      status: 'shipped',
      shippingAddress: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        address2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
      },
      billingAddress: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        address2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
      },
      paymentMethod: 'Credit Card ending in 1234',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
    },
    {
      id: 'ORD-003',
      userId: user?.id ?? '1',
      items: [
        {
          id: '4',
          product: {
            id: '4',
            name: 'Stainless Steel Water Bottle',
            price: 24.99,
            description: 'Durable stainless steel water bottle',
            image: 'https://via.placeholder.com/100x100',
            category: 'Sports',
            brand: 'HydroFlask',
            rating: 4.7,
            reviewCount: 124,
            inStock: true,
            stockQuantity: 30,
          },
          quantity: 1,
        },
      ],
      total: 24.99,
      subtotal: 24.99,
      tax: 0,
      shipping: 0,
      status: 'processing',
      shippingAddress: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        address2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
      },
      billingAddress: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        address2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
      },
      paymentMethod: 'Credit Card ending in 1234',
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
    },
  ];

  const filteredOrders = selectedStatus === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === selectedStatus);

  const getStatusBadgeColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your orders</h2>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -32 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600 mt-2">View and track all your orders</p>
          </div>

          {/* Filter Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Orders', count: mockOrders.length },
                { key: 'pending', label: 'Pending', count: mockOrders.filter(o => o.status === 'pending').length },
                { key: 'processing', label: 'Processing', count: mockOrders.filter(o => o.status === 'processing').length },
                { key: 'shipped', label: 'Shipped', count: mockOrders.filter(o => o.status === 'shipped').length },
                { key: 'delivered', label: 'Delivered', count: mockOrders.filter(o => o.status === 'delivered').length },
                { key: 'cancelled', label: 'Cancelled', count: mockOrders.filter(o => o.status === 'cancelled').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatus(tab.key as typeof selectedStatus)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedStatus === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
                <div className="mt-6">
                  <Link
                    to="/products"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Placed on {order.createdAt.toLocaleDateString()}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <p>Payment: {order.paymentMethod}</p>
                          <p>Shipping to: {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">Total: ${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          View Details
                        </Link>
                        
                        <div className="flex space-x-2">
                          {order.status === 'delivered' && (
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200">
                              Rate & Review
                            </button>
                          )}
                          
                          {(order.status === 'pending' || order.status === 'processing') && (
                            <button className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
                              Cancel Order
                            </button>
                          )}
                          
                          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Reorder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </motion.div>
  );
}
