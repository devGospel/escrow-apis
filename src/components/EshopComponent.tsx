"use client";

import React, { useState } from 'react';
import Header from './Header';
import Login from './Login';
import Register from './Register';
import CreateTransactionModal from './CreateTransactionModal';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
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

const EshopComponent: React.FC = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('default');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
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
    setSelectedProduct(null);
  };

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
      console.log('[EshopComponent] Opening login modal: User not authenticated');
      setShowLogin(true);
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
    setIsSidebarOpen(false);
  };

  const handleShowRegister = () => {
    console.log('[EshopComponent] Showing register modal');
    setShowRegister(true);
    setIsSidebarOpen(false);
  };

  const handleCloseModal = () => {
    console.log('[EshopComponent] Closing modal');
    setShowLogin(false);
    setShowRegister(false);
    setShowTransactionModal(false);
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
      <div className={`py-8 px-4 sm:px-6 lg:px-8 ${showLogin || showRegister || showTransactionModal ? 'backdrop-blur-sm' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Our Products</h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Sidebar (Slide-in Drawer on Mobile) */}
            <div
              className={`fixed inset-y-0 left-0 z-50 w-3/4 sm:w-1/2 lg:w-1/4 bg-white dark:bg-gray-800 p-6 shadow-lg transform transition-transform duration-300 ${
                isSidebarOpen && !(showLogin || showRegister || showTransactionModal) ? 'translate-x-0' : '-translate-x-full'
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
            {isSidebarOpen && !(showLogin || showRegister || showTransactionModal) && (
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
                      <img
                        src={product.image}
                        alt={product.name}
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

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Login
            onClose={handleCloseModal}
            onSwitchToRegister={handleShowRegister}
            onLoginSuccess={resetComponentState}
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