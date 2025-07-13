import { Transaction, TransactionsResponse } from '@/hooks/useTransactions';

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 100.0,
    currency: 'SOL',
    status: 'completed',
    timestamp: '2024-01-15T10:30:00Z',
    description: 'Initial deposit',
    txHash: '0x1234567890abcdef...'
  },
  {
    id: '2',
    type: 'bet',
    amount: 10.0,
    currency: 'SOL',
    status: 'completed',
    timestamp: '2024-01-15T11:00:00Z',
    description: 'Crash game bet',
    gameId: 'crash_001'
  },
  {
    id: '3',
    type: 'win',
    amount: 25.5,
    currency: 'SOL',
    status: 'completed',
    timestamp: '2024-01-15T11:05:00Z',
    description: 'Crash game win',
    gameId: 'crash_001'
  },
  {
    id: '4',
    type: 'bet',
    amount: 15.0,
    currency: 'SOL',
    status: 'completed',
    timestamp: '2024-01-15T11:10:00Z',
    description: 'Crash game bet',
    gameId: 'crash_002'
  },
  {
    id: '5',
    type: 'loss',
    amount: 15.0,
    currency: 'SOL',
    status: 'completed',
    timestamp: '2024-01-15T11:12:00Z',
    description: 'Crash game loss',
    gameId: 'crash_002'
  },
  {
    id: '6',
    type: 'withdrawal',
    amount: 50.0,
    currency: 'SOL',
    status: 'pending',
    timestamp: '2024-01-15T12:00:00Z',
    description: 'Withdrawal request',
    txHash: '0xabcdef1234567890...'
  },
  {
    id: '7',
    type: 'deposit',
    amount: 200.0,
    currency: 'SOL',
    status: 'completed',
    timestamp: '2024-01-16T09:00:00Z',
    description: 'Additional deposit',
    txHash: '0x9876543210fedcba...'
  },
  {
    id: '8',
    type: 'bet',
    amount: 25.0,
    currency: 'SOL',
    status: 'completed',
    timestamp: '2024-01-16T10:00:00Z',
    description: 'Crash game bet',
    gameId: 'crash_003'
  },
  {
    id: '9',
    type: 'win',
    amount: 75.0,
    currency: 'SOL',
    status: 'completed',
    timestamp: '2024-01-16T10:05:00Z',
    description: 'Crash game win',
    gameId: 'crash_003'
  },
  {
    id: '10',
    type: 'bet',
    amount: 30.0,
    currency: 'SOL',
    status: 'completed',
    timestamp: '2024-01-16T11:00:00Z',
    description: 'Crash game bet',
    gameId: 'crash_004'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function mockFetchTransactions(
  page: number = 1,
  limit: number = 10
): Promise<TransactionsResponse> {
  // Simulate network delay
  await delay(500 + Math.random() * 1000);

  // Simulate occasional errors
  if (Math.random() < 0.1) {
    throw new Error('Network error - please try again');
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTransactions = mockTransactions.slice(startIndex, endIndex);

  const totalItems = mockTransactions.length;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    transactions: paginatedTransactions,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
} 