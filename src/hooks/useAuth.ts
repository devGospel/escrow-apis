"use client";

import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../contants/api';

interface User {
  _id: string;
  email: string;
  phone: string;
  role: string;
  business_verification?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface Seller {
  _id: string;
  email: string;
  name?: string;
  role: string;
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sellers: Seller[];
  sellersLoading: boolean;
  sellersError: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    sellers: [],
    sellersLoading: false,
    sellersError: null,
  });

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      }, { withCredentials: true });
      const { access_token, refresh_token, user } = response.data;
      setAuthState({
        user,
        accessToken: access_token,
        refreshToken: refresh_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sellers: [],
        sellersLoading: false,
        sellersError: null,
      });
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.response?.data?.message || 'Login failed',
      }));
      return false;
    }
  };

  const register = async (email: string, password: string, phone: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        phone,
        role: 'buyer',
      }, { withCredentials: true });
      const { access_token, refresh_token, user } = response.data;
      setAuthState({
        user,
        accessToken: access_token,
        refreshToken: refresh_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sellers: [],
        sellersLoading: false,
        sellersError: null,
      });
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.response?.data?.message || 'Registration failed',
      }));
      return false;
    }
  };

  const verify = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const userString = localStorage.getItem('user');
    if (!accessToken) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return;
    }
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      const user = userString ? JSON.parse(userString) : response.data.user;
      setAuthState((prev) => ({
        ...prev,
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sellers: [],
        sellersLoading: false,
        sellersError: null,
      }));
    } catch {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        sellers: [],
        sellersLoading: false,
        sellersError: null,
      }));
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      sellers: [],
      sellersLoading: false,
      sellersError: null,
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const getAllSellers = useCallback(async (): Promise<Seller[]> => {
    console.log('[getAllSellers] Fetching sellers');
    setAuthState((prev) => ({ ...prev, sellersLoading: true, sellersError: null, sellers: [] }));

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.log('[getAllSellers] No access token found');
      setAuthState((prev) => ({ ...prev, sellersLoading: false, sellersError: 'Authentication required to fetch sellers', sellers: [] }));
      return [];
    }

    try {
      const response = await axios.get<Seller[]>(`${API_BASE_URL}/auth/sellers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      const sellersData = Array.isArray(response.data) ? response.data : [];
      console.log('[getAllSellers] Sellers fetched successfully:', sellersData.length);
      setAuthState((prev) => ({
        ...prev,
        sellers: sellersData.filter(seller => seller.is_active),
        sellersLoading: false,
        sellersError: null,
      }));
      return sellersData.filter(seller => seller.is_active);
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      console.error('[getAllSellers] Error fetching sellers:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage = err.response?.data?.message || 'Failed to fetch sellers';
      setAuthState((prev) => ({
        ...prev,
        sellersLoading: false,
        sellersError: errorMessage,
        sellers: [],
      }));
      return [];
    }
  }, []);

  useEffect(() => {
    verify();
  }, []);

  return {
    token: authState.accessToken,
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    sellers: authState.sellers,
    sellersLoading: authState.sellersLoading,
    sellersError: authState.sellersError,
    login,
    register,
    logout,
    verify,
    getAllSellers,
  };
};