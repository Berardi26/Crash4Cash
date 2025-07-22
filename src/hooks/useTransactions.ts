'use client'
import { useState, useEffect, useCallback } from 'react';

// Define transaction interface
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'loss';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  description?: string;
  txHash?: string;
  gameId?: string;
}

// Define pagination interface
export interface PaginationParams {
  page: number;
  limit: number;
}

// Define API response interface
export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Define hook return interface
export interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  pagination: TransactionsResponse['pagination'] | null;
  fetchTransactions: (params?: Partial<PaginationParams>) => Promise<void>;
  loadNextPage: () => Promise<void>;
  loadPrevPage: () => Promise<void>;
  refresh: () => Promise<void>;
}

// API base URL - replace with your actual API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.futuresea.fun';

export function useTransactions(): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<TransactionsResponse['pagination'] | null>(null);

  const fetchTransactions = useCallback(async (params: Partial<PaginationParams> = {}) => {
    const { page = 1, limit = 10 } = params;
    
    setLoading(true);
    setError(null);

    try {
      // For now, using mock data. Replace this with actual API call when ready
      const { mockFetchTransactions } = await import('@/utils/mockTransactions');
      const data = await mockFetchTransactions(page, limit);
      
      setTransactions(data.transactions);
      setPagination(data.pagination);
      
      // TODO: Replace with actual API call when server is ready
      // const walletAddress = ''; // Get from wallet context
      // const queryParams = new URLSearchParams({
      //   page: page.toString(),
      //   limit: limit.toString(),
      // });
      // 
      // if (walletAddress) {
      //   queryParams.append('wallet', walletAddress);
      // }
      //
      // const response = await fetch(`${API_BASE_URL}/api/transactions?${queryParams}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // 'Authorization': `Bearer ${token}`
      //   },
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      //
      // const data: TransactionsResponse = await response.json();
      // setTransactions(data.transactions);
      // setPagination(data.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadNextPage = useCallback(async () => {
    if (pagination?.hasNextPage) {
      await fetchTransactions({ page: pagination.currentPage + 1 });
    }
  }, [pagination, fetchTransactions]);

  const loadPrevPage = useCallback(async () => {
    if (pagination?.hasPrevPage) {
      await fetchTransactions({ page: pagination.currentPage - 1 });
    }
  }, [pagination, fetchTransactions]);

  const refresh = useCallback(async () => {
    await fetchTransactions({ page: 1 });
  }, [fetchTransactions]);

  // Load initial data
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    pagination,
    fetchTransactions,
    loadNextPage,
    loadPrevPage,
    refresh,
  };
} 