# Authentication System

## Overview

The FutureSea frontend implements a comprehensive authentication system using Solana wallet connection and JWT tokens. The system provides automatic sign up/sign in functionality with protected routes.

## Features

- 🔐 **Wallet-based Authentication**: Connect Solana wallet for automatic sign up/sign in
- 🛡️ **Protected Routes**: Profile page and other sensitive areas require authentication
- 🔄 **Auto-refresh**: JWT tokens are automatically refreshed
- 💾 **Persistent Sessions**: Authentication state persists across browser sessions
- 🎨 **User Interface**: Loading states, error handling, and user feedback

## Components

### 1. AuthContext (`src/contexts/AuthContext.tsx`)

The main authentication context that manages:
- User state and authentication status
- JWT token management
- Wallet connection handling
- Local storage persistence

**Usage:**
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user, isAuthenticated, login, logout } = useAuth();
```

### 2. ProtectedRoute (`src/components/auth/ProtectedRoute.tsx`)

A wrapper component that protects routes requiring authentication:
- Redirects unauthenticated users to home page
- Shows loading states during authentication checks
- Provides wallet connection prompts

**Usage:**
```typescript
import ProtectedRoute from '@/components/auth/ProtectedRoute';

<ProtectedRoute>
  <YourProtectedComponent />
</ProtectedRoute>
```

### 3. LoadingSpinner (`src/components/auth/LoadingSpinner.tsx`)

A reusable loading component for authentication states:
- Customizable sizes and text
- Consistent styling across the app

### 4. AuthStatus (`src/components/auth/AuthStatus.tsx`)

A component that displays current authentication status:
- Shows user avatar and username when authenticated
- Displays wallet connection button when not authenticated
- Handles loading states

## Authentication Flow

1. **User connects wallet** → AuthContext detects connection
2. **Auto-authentication** → Backend API call to `/auth/connect-wallet`
3. **Token storage** → JWT token stored in localStorage
4. **State update** → User data and authentication status updated
5. **Route protection** → Protected routes become accessible

## Protected Routes

### Profile Page (`/profile`)
- Requires authentication
- Shows user information and statistics
- Provides disconnect functionality

### Implementation
```typescript
// src/app/profile/page.tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const ProfilePage = () => {
  return (
    <ProtectedRoute>
      <Layout>
        {/* Profile content */}
      </Layout>
    </ProtectedRoute>
  );
};
```

## Environment Configuration

Create a `.env.local` file in the frontend root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# App Configuration
NEXT_PUBLIC_APP_NAME=FutureSea
NEXT_PUBLIC_APP_DESCRIPTION=Casino web3 game on solana

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

## API Integration

The frontend communicates with the backend API for authentication:

### Connect Wallet
```typescript
POST /api/auth/connect-wallet
{
  "walletAddress": "user_wallet_address"
}
```

### Response
```json
{
  "token": "jwt_token",
  "isNewUser": true/false,
  "user": {
    "id": "user_id",
    "walletAddress": "wallet_address",
    "username": "auto_generated_username",
    "isVerified": true,
    "balance": 0,
    "totalBets": 0,
    "totalWins": 0,
    "totalLosses": 0,
    "totalWagered": 0,
    "totalWon": 0,
    "winRate": "0.00",
    "profitLoss": 0
  }
}
```

## User Interface

### Authentication States

1. **Loading**: Shows spinner while checking authentication
2. **Not Authenticated**: Shows wallet connection button
3. **Authenticated**: Shows user avatar and username
4. **Connecting**: Shows "Connecting..." message

### Navigation Updates

The navbar now shows:
- User avatar with username when authenticated
- Wallet connection button when not authenticated
- Loading indicator during authentication checks

## Security Features

- **JWT Tokens**: Secure session management
- **Token Refresh**: Automatic token renewal
- **Local Storage**: Persistent authentication state
- **Route Protection**: Unauthorized access prevention
- **Error Handling**: Graceful error management

## Error Handling

The system handles various error scenarios:
- Network failures
- Invalid tokens
- Wallet connection issues
- API errors

## Development

### Adding New Protected Routes

1. Wrap your component with `ProtectedRoute`:
```typescript
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const YourProtectedComponent = () => {
  return (
    <ProtectedRoute>
      {/* Your component content */}
    </ProtectedRoute>
  );
};
```

2. Use the `useAuth` hook for authentication data:
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user, isAuthenticated, logout } = useAuth();
```

### Custom Authentication Guards

Use the `useAuthGuard` hook for custom authentication logic:
```typescript
import { useAuthGuard } from '@/hooks/useAuthGuard';

const { isAuthenticated, isLoading, shouldRender } = useAuthGuard({
  redirectTo: '/login',
  requireAuth: true
});
```

## Testing

The authentication system can be tested by:
1. Connecting a Solana wallet
2. Navigating to protected routes
3. Testing logout functionality
4. Verifying persistent sessions

## Troubleshooting

### Common Issues

1. **Wallet not connecting**: Check Solana network configuration
2. **API errors**: Verify backend is running and API URL is correct
3. **Token issues**: Clear localStorage and reconnect wallet
4. **Route protection not working**: Ensure ProtectedRoute is properly implemented

### Debug Mode

Enable debug logging by adding to your component:
```typescript
const { user, isAuthenticated, isLoading } = useAuth();
console.log('Auth state:', { user, isAuthenticated, isLoading });
``` 