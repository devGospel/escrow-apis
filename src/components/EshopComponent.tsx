"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Login from '@/components/Login';
import Register from '@/components/Register';
import CreateTransactionModal from '@/components/CreateTransactionModal';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface EshopComponentProps {
  refreshKey: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99 * 1500,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
    description: "High-quality wireless headphones with noise cancellation.",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smartwatch",
    price: 199.99 * 1500,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
    description: "Sleek smartwatch with fitness tracking and notifications.",
    category: "Wearables",
  },
  {
    id: 3,
    name: "Leather Backpack",
    price: 149.99 * 1500,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    description: "Premium leather backpack for daily use.",
    category: "Accessories",
  },
  {
    id: 4,
    name: "Sunglasses",
    price: 79.99 * 1500,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
    description: "Stylish polarized sunglasses for all occasions.",
    category: "Accessories",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 59.99 * 1500,
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7",
    description: "Portable Bluetooth speaker with rich sound.",
    category: "Electronics",
  },
  {
    id: 6,
    name: "Fitness Tracker",
    price: 129.99 * 1500,
    image: "https://images.unsplash.com/photo-1576243345696-84e237745d84",
    description: "Track your steps, heart rate, and sleep patterns.",
    category: "Wearables",
  },
  {
    id: 7,
    name: "Laptop Stand",
    price: 39.99 * 1500,
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97",
    description: "Ergonomic laptop stand for comfortable working.",
    category: "Accessories",
  },
  {
    id: 8,
    name: "USB-C Charger",
    price: 29.99 * 1500,
    image: "https://images.unsplash.com/photo-1606292369077-54b64a1b7a04",
    description: "Fast-charging USB-C charger for all devices.",
    category: "Electronics",
  },
];

const EshopComponent: React.FC<EshopComponentProps> = ({ refreshKey }) => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('default');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Reset component state to initial values
  const resetComponentState = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSortOption('default');
    setIsSidebarOpen(false);
    setShowLogin(false);
    setShowRegister(false);
    setShowTransactionModal(false);
    setShowLoginPrompt(false);
    setSelectedProduct(null);
  };

  // Trigger reset on login (when isAuthenticated or refreshKey changes)
  useEffect(() => {
    if (isAuthenticated) {
      resetComponentState();
    }
  }, [isAuthenticated, refreshKey]);

  // Get unique categories
  const categories = Array.from(new Set(products.map((product) => product.category)));

  // Filter and sort products
  const filteredProducts = products
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'price-low-high') return a.price - b.price;
      if (sortOption === 'price-high-low') return b.price - a.price;
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Format price to Naira with commas
  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      console.log('[EshopComponent] Showing login prompt: User not authenticated');
      setShowLoginPrompt(true);
      setIsSidebarOpen(false);
    } else {
      console.log('[EshopComponent] Opening transaction modal: User authenticated');
      setShowTransactionModal(true);
      setIsSidebarOpen(false);
    }
  };

  const handleShowLogin = () => {
    console.log('[EshopComponent] Showing login modal');
    setShowLogin(true);
    setShowLoginPrompt(false);
    setIsSidebarOpen(false);
  };

  const handleShowRegister = () => {
    console.log('[EshopComponent] Showing register modal');
    setShowRegister(true);
    setShowLoginPrompt(false);
    setIsSidebarOpen(false);
  };

  const handleCloseModal = () => {
    console.log('[EshopComponent] Closing modal');
    setShowLogin(false);
    setShowRegister(false);
    setShowTransactionModal(false);
    setShowLoginPrompt(false);
  };

  const handleProceedToLogin = () => {
    setShowLoginPrompt(false);
    setShowLogin(true);
  };

  // Modified Header component to pass resetComponentState
  const HeaderWithReset: React.FC = () => (
    <Header
      onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      onLogout={async () => {
        await logout();
        resetComponentState();
      }}
      onLoginSuccess={resetComponentState}
    />
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-poppins">
      <HeaderWithReset />
      <div className={`py-8 px-4 sm:px-6 lg:px-8 ${showLogin || showRegister || showTransactionModal || showLoginPrompt ? 'backdrop-blur-sm' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Our Products</h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Sidebar (Slide-in Drawer on Mobile) */}
            <div
              className={`fixed inset-y-0 left-0 z-50 w-3/4 sm:w-1/2 lg:w-1/4 bg-white dark:bg-gray-800 p-6 shadow-lg transform transition-transform duration-300 ${
                isSidebarOpen && !(showLogin || showRegister || showTransactionModal || showLoginPrompt) ? 'translate-x-0' : '-translate-x-full'
              } lg:static lg:translate-x-0 lg:block`}
            >
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
                <button
                  className="lg:hidden text-gray-600 dark:text-gray-300"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="mb-6">
                <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left py-2 px-3 text-sm rounded-md ${
                        selectedCategory === null
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className={`w-full text-left py-2 px-3 text-sm rounded-md ${
                          selectedCategory === category
                            ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">Sort By</h3>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="default">Default</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Overlay for Mobile Sidebar */}
            {isSidebarOpen && !(showLogin || showRegister || showTransactionModal || showLoginPrompt) && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              ></div>
            )}

            {/* Product Grid */}
            <div className="w-full lg:w-3/4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-center text-sm col-span-full">
                    No products found.
                  </p>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={256}
                        className="w-full h-48 sm:h-64 object-cover"
                      />
                      <div className="p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">{product.name}</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{product.description}</p>
                        <p className="mt-3 text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                          {formatPrice(product.price)}
                        </p>
                        <button
                          className="mt-4 w-full bg-indigo-600 dark:bg-indigo-500 text-white dark:text-gray-100 py-2 px-4 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-200 text-sm sm:text-base disabled:opacity-50"
                          onClick={() => handleAddToCart(product)}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Loading...' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h2 className="mt-4 text-xl font-bold text-center text-gray-900 dark:text-gray-100">
                Authentication Required
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  You need to be logged in to add items to your cart.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                  Please login or create an account to continue shopping.
                </p>
                
                {selectedProduct && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded"
                      />
                      <div className="flex-1 text-left">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {selectedProduct.name}
                        </h3>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                          {formatPrice(selectedProduct.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToLogin}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 border border-transparent rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Login</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
              
              {/* Register prompt */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      setShowRegister(true);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition duration-200"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Login
            onClose={handleCloseModal}
            onSwitchToRegister={handleShowRegister}
            onLoginSuccess={() => {
              window.location.reload(); // refresh whole page
            }}
          />
        </div>
      )}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Register
            onClose={handleCloseModal}
            onSwitchToLogin={handleShowLogin}
          />
        </div>
      )}
      {showTransactionModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <CreateTransactionModal
            product={selectedProduct}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
};

export default EshopComponent;