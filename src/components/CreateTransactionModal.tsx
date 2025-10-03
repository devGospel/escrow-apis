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
    getAllSellers(); // Fetch sellers when the modal mounts
  }, [getAllSellers]);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTransaction({
      title: product.name,
      amount: product.price,
      product_image: product.image,
      product_description: product.description,
      payment_platform: paymentPlatform,
      seller_id: selectedSellerId || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center font-poppins z-50">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Create Transaction</h2>
        {(error || sellersError) && (
          <p className="text-red-500 text-sm mb-4">{error || sellersError}</p>
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
              value={`₦${product.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Select Seller</label>
            {sellersLoading ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Loading sellers...</p>
            ) : sellersError ? (
              <p className="text-red-500 text-sm">Error loading sellers: {sellersError}</p>
            ) : !Array.isArray(sellers) || sellers.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No sellers available</p>
            ) : (
              <select
                value={selectedSellerId}
                onChange={(e) => setSelectedSellerId(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Select a seller (optional)</option>
                {sellers.map((seller) => (
                  <option key={seller._id} value={seller._id}>
                    {seller.name || seller.email}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Payment Platform</label>
            <select
              value={paymentPlatform}
              onChange={(e) => setPaymentPlatform(e.target.value as 'paypal' | 'flutterwave')}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="paypal">PayPal</option>
              <option value="flutterwave">Flutterwave</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading || sellersLoading}
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white dark:text-gray-100 py-2 px-4 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-200 text-sm sm:text-base disabled:opacity-50"
          >
            {isLoading ? 'Creating Transaction...' : 'Create Transaction'}
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 text-gray-600 dark:text-gray-400 hover:underline text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CreateTransactionModal;