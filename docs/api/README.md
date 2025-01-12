# API Documentation

## Authentication APIs

### Registration
- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/complete-profile`

### Login
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Profile
- `GET /api/profile`
- `PUT /api/profile/update`
- `POST /api/profile/upload-photo`
- `POST /api/profile/upload-video`

## Dashboard APIs

### Activity
- `GET /api/activity`
- `GET /api/activity/:id`

### Assignments
- `GET /api/assignments`
- `GET /api/assignments/:id`
- `POST /api/assignments/update-status`

### Banking
- `GET /api/banking/accounts`
- `POST /api/banking/add-account`
- `PUT /api/banking/update-account`

### Chat
- `GET /api/chat/conversations`
- `GET /api/chat/messages/:conversationId`
- `POST /api/chat/send-message`

### Work Management
- `GET /api/work/history`
- `POST /api/work/log`
- `GET /api/work/performance`

### Financial
- `GET /api/wallet/balance`
- `GET /api/wallet/transactions`
- `POST /api/payments/process`

## Data Models

### User Profile
```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  phone: string;
  civilId: string;
  driverLicense?: string;
  photo?: string;
  video?: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
}
```

### Work Assignment
```typescript
interface Assignment {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  startDate: string;
  endDate: string;
  payment: number;
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```typescript
interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

Common error codes:
- `AUTH_001`: Authentication failed
- `AUTH_002`: Invalid credentials
- `PROFILE_001`: Profile update failed
- `UPLOAD_001`: File upload failed 