"use client";

import React, { useState, useEffect } from 'react';
import { useTransaction } from '@/hooks/useTransaction';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface CreateTransactionModalProps {
  product: Product;
  onClose: () => void;
}

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({ product, onClose }) => {
  const [paymentPlatform, setPaymentPlatform] = useState<'paypal' | 'flutterwave'>('paypal');
  const [selectedSellerId, setSelectedSellerId] = useState<string>('');
  const { createTransaction, isLoading, error } = useTransaction();
  const { getAllSellers, sellers, sellersLoading, sellersError } = useAuth();

  useEffect(() => {
    console.log('[CreateTransactionModal] Mounted, fetching sellers...');
    getAllSellers(); // Fetch sellers when the modal mounts
  }, [getAllSellers]);

  // Debug effect to log sellers state changes
  useEffect(() => {
    console.log('[CreateTransactionModal] Sellers state updated:', {
      sellersCount: sellers?.length || 0,
      sellers,
      sellersLoading,
      sellersError
    });
  }, [sellers, sellersLoading, sellersError]);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSellerId) {
      alert('Please select a seller');
      return;
    }

    console.log('[CreateTransactionModal] Creating transaction with seller:', selectedSellerId);
    
    await createTransaction({
      title: product.name,
      amount: product.price,
      product_image: product.image,
      product_description: product.description,
      payment_platform: paymentPlatform,
      seller_id: selectedSellerId,
    });
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center font-poppins z-50">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Create Transaction</h2>
        
        {/* Display errors */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {sellersError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">Error loading sellers: {sellersError}</p>
            <button
              onClick={() => getAllSellers()}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
            >
              Retry
            </button>
          </div>
        )}

        <form onSubmit={handleCreateTransaction}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Product Title</label>
            <input
              type="text"
              value={product.name}
              readOnly
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Amount (NGN)</label>
            <input
              type="text"
              value={formatPrice(product.price)}
              readOnly
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Product Image URL</label>
            <input
              type="text"
              value={product.image}
              readOnly
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Product Description</label>
            <textarea
              value={product.description}
              readOnly
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
              rows={3}
            />
          </div>
          
          {/* Seller Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
              Select Seller *
            </label>
            
            {sellersLoading ? (
              <div className="flex items-center justify-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-2"></div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Loading sellers...</span>
              </div>
            ) : !Array.isArray(sellers) || sellers.length === 0 ? (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                  {sellersError ? 'Failed to load sellers' : 'No sellers available'}
                </p>
                <button
                  type="button"
                  onClick={() => getAllSellers()}
                  className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <select
                value={selectedSellerId}
                onChange={(e) => setSelectedSellerId(e.target.value)}
                required
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a seller</option>
                {sellers.map((seller) => (
                  <option key={seller._id} value={seller._id}>
                    {seller.name || seller.email} {seller.is_active ? '' : '(Inactive)'}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Payment Platform</label>
            <select
              value={paymentPlatform}
              onChange={(e) => setPaymentPlatform(e.target.value as 'paypal' | 'flutterwave')}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="paypal">PayPal</option>
              <option value="flutterwave">Flutterwave</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || sellersLoading || !selectedSellerId}
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white dark:text-gray-100 py-2 px-4 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Transaction...' : 'Create Transaction'}
          </button>
        </form>
        
        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-200 text-sm border border-gray-300 dark:border-gray-600 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CreateTransactionModal;