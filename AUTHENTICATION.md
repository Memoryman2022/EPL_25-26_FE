# Authentication System Documentation

## Overview

This project uses JWT (JSON Web Tokens) for authentication. The system includes:

- JWT token generation and verification
- Protected API routes with middleware
- User context management
- Secure logout functionality

## Environment Variables

Add these to your `.env` file:

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/EPL2025

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Features

### 1. JWT Token Generation

- Tokens are generated with user information (userId, email, userName, role)
- Tokens expire after 7 days
- Secure token verification

### 2. Protected API Routes

The following routes require authentication:

- `/api/predictions/*`
- `/api/users/*`
- `/api/standings/*`

### 3. User Context

The `UserProvider` manages user state and provides:

- `user`: Current user object
- `setUser`: Function to update user
- `authLoaded`: Boolean indicating if auth check is complete
- `logout`: Function to log out user

### 4. API Utilities

Use the `api` utility for authenticated requests:

```typescript
import { api } from "@/lib/api";

// GET request
const data = await api.get("/api/predictions?fixtureId=1");

// POST request
const result = await api.post("/api/predictions", {
  fixtureId: 1,
  homeScore: 2,
  awayScore: 1,
  outcome: "home",
  odds: 2.5,
});
```

## Usage Examples

### Login/Register

```typescript
import { useUser } from "@/app/auth/components/Context";

const { user, logout } = useUser();

if (user) {
  console.log("User is logged in:", user.userName);
} else {
  console.log("User is not logged in");
}
```

### Making Authenticated API Calls

```typescript
import { api } from "@/lib/api";

try {
  const predictions = await api.get("/api/predictions/user");
  console.log("User predictions:", predictions);
} catch (error) {
  console.error("API call failed:", error);
}
```

### Logout

```typescript
import { useUser } from "@/app/auth/components/Context";

const { logout } = useUser();

// This will clear all auth data and redirect
logout();
```

## Security Features

1. **JWT Secret**: Uses environment variable for JWT signing
2. **Token Expiration**: Tokens expire after 7 days
3. **Protected Routes**: Middleware protects sensitive API endpoints
4. **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
5. **User Validation**: All protected routes validate user identity

## File Structure

```
src/
├── lib/
│   ├── jwt.ts          # JWT utilities
│   ├── api.ts          # API utilities
│   └── mongodb.ts      # Database connection
├── app/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── AuthForm.tsx    # Login/Register form
│   │   │   └── Context.tsx     # User context
│   │   └── api/auth/
│   │       ├── login/route.ts
│   │       ├── register/route.ts
│   │       └── logout/route.ts
│   └── api/
│       └── predictions/route.ts # Protected route example
└── middleware.ts       # Authentication middleware
```

## Production Considerations

1. **JWT Secret**: Use a strong, unique secret in production
2. **HTTPS**: Always use HTTPS in production
3. **Token Storage**: Consider using httpOnly cookies instead of localStorage
4. **Rate Limiting**: Implement rate limiting for auth endpoints
5. **Password Policy**: Enforce strong password requirements
6. **Session Management**: Consider implementing refresh tokens
