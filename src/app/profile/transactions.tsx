'use client'
import { useTransactions } from '@/hooks/useTransactions';
import { Button, Card, CardBody, CardHeader, Chip, Spinner } from '@heroui/react';
import { ChevronLeftIcon, ChevronRightIcon, ReloadIcon } from '@radix-ui/react-icons';

const TransactionsPanel = () => {
    const {
        transactions,
        loading,
        error,
        pagination,
        loadNextPage,
        loadPrevPage,
        refresh
    } = useTransactions();

    const formatAmount = (amount: number, currency: string) => {
        return `${amount.toFixed(4)} ${currency}`;
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
                return 'danger';
            default:
                return 'default';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'win':
                return 'success';
            case 'loss':
                return 'danger';
            case 'deposit':
                return 'primary';
            case 'withdrawal':
                return 'secondary';
            case 'bet':
                return 'warning';
            default:
                return 'default';
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onPress={refresh} color="primary">
                    <ReloadIcon />
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <Button 
                    onPress={refresh} 
                    color="primary" 
                    variant="flat"
                    isLoading={loading}
                >
                    <ReloadIcon />
                    Refresh
                </Button>
            </div>

            {loading && transactions.length === 0 ? (
                <div className="flex justify-center items-center p-8">
                    <Spinner size="lg" />
                </div>
            ) : transactions.length === 0 ? (
                <Card className="w-full">
                    <CardBody className="text-center py-8">
                        <p className="text-gray-500">No transactions found</p>
                    </CardBody>
                </Card>
            ) : (
                <>
                    <div className="space-y-4">
                        {transactions.map((transaction) => (
                            <Card key={transaction.id} className="w-full">
                                <CardBody className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <Chip 
                                                        color={getTypeColor(transaction.type)}
                                                        variant="flat"
                                                        size="sm"
                                                    >
                                                        {transaction.type.toUpperCase()}
                                                    </Chip>
                                                    <Chip 
                                                        color={getStatusColor(transaction.status)}
                                                        variant="flat"
                                                        size="sm"
                                                    >
                                                        {transaction.status}
                                                    </Chip>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {transaction.description || transaction.type}
                                                </p>
                                                {transaction.gameId && (
                                                    <p className="text-xs text-gray-400">
                                                        Game ID: {transaction.gameId}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className={`font-semibold ${
                                                transaction.type === 'win' || transaction.type === 'deposit' 
                                                    ? 'text-green-500' 
                                                    : transaction.type === 'loss' || transaction.type === 'withdrawal'
                                                    ? 'text-red-500'
                                                    : 'text-gray-500'
                                            }`}>
                                                {transaction.type === 'loss' || transaction.type === 'withdrawal' ? '-' : '+'}
                                                {formatAmount(transaction.amount, transaction.currency)}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {formatDate(transaction.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {pagination && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-500">
                                Page {pagination.currentPage} of {pagination.totalPages} 
                                ({pagination.totalItems} total items)
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onPress={loadPrevPage}
                                    disabled={!pagination.hasPrevPage || loading}
                                    variant="flat"
                                    size="sm"
                                >
                                    <ChevronLeftIcon />
                                    Previous
                                </Button>
                                <Button
                                    onPress={loadNextPage}
                                    disabled={!pagination.hasNextPage || loading}
                                    variant="flat"
                                    size="sm"
                                >
                                    Next
                                    <ChevronRightIcon />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TransactionsPanel;