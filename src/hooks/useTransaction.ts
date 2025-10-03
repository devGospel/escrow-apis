"use client";

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';
import { API_BASE_URL } from '../contants/api';

interface Seller {
  _id: string;
  email: string;
  name?: string;
  role: string;
  is_active: boolean;
}

interface TransactionData {
  title: string;
  amount: number;
  product_image: string;
  product_description: string;
  payment_platform: 'paypal' | 'flutterwave';
  seller_id?: string;
}

interface TransactionResponse {
  message: string;
  transaction_id?: string;
  redirect_url?: string;
  payment_platform?: string;
}

export const useTransaction = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionResponse, setTransactionResponse] = useState<TransactionResponse | null>(null);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [sellersLoading, setSellersLoading] = useState(false);
  const [sellersError, setSellersError] = useState<string | null>(null);

  const createTransaction = async (data: TransactionData) => {
    setIsLoading(true);
    setError(null);
    setTransactionResponse(null);

    try {
      const response = await axios.post<TransactionResponse>(
        `${API_BASE_URL}/transactions/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setTransactionResponse(response.data);
      if (response.data.redirect_url) {
        window.location.href = response.data.redirect_url; // Redirect to payment provider
      } else {
        setError('No redirect URL received from server');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSellers = async () => {
    setSellersLoading(true);
    setSellersError(null);
    setSellers([]);

    try {
      const response = await axios.get<Seller[]>(
        `${API_BASE_URL}/transactions/sellers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSellers(response.data.filter(seller => seller.is_active));
    } catch (err: any) {
      setSellersError(err.response?.data?.message || 'Failed to fetch sellers');
    } finally {
      setSellersLoading(false);
    }
  };

  return { createTransaction, fetchSellers, sellers, isLoading, error, transactionResponse, sellersLoading, sellersError };
};