# Architecture Overview

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   │   ├── login/
│   │   ├── complete/
│   │   ├── email/
│   │   └── ...
│   ├── (dash)/            # Dashboard routes
│   │   ├── activity/
│   │   ├── assignment/
│   │   ├── chat/
│   │   └── ...
│   └── api/               # API routes
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Core utilities
├── models/               # Data models
├── providers/            # Context providers
├── store/                # Redux store
└── utils/                # Utility functions
```

## Core Technologies

### Frontend Framework
- Next.js 15.0.3 with App Router
- React 18.3.1
- TypeScript for type safety

### State Management
- Redux Toolkit for global state
- React Context for UI state
- React Hook Form for form state

### UI Components
- TailwindCSS for styling
- shadcn/ui component library
- Custom components in /components/ui

### Data Validation
- Zod schema validation
- Type-safe forms
- API request/response validation

### Monitoring & Analytics
- Sentry for error tracking
- Mixpanel for user analytics
- Custom logging implementations

### Internationalization
- i18next integration
- Language detection
- Translation management

## Key Design Patterns

### Authentication Flow
- Multi-step registration
- Protected routes
- Session management

### Data Flow
- Redux actions/reducers
- API integration
- Error handling

### Component Architecture
- Atomic design principles
- Reusable components
- Type-safe props

### Form Management
- Controlled components
- Validation schemas
- Error handling

### API Integration
- RESTful endpoints
- Type-safe requests
- Error boundaries 