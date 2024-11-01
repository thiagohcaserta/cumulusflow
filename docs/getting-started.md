# Getting Started with CumulusFlow

Welcome to CumulusFlow! This guide will help you get started with building modern, AI-enhanced applications.

## Prerequisites

- Node.js 18 or later
- npm 7 or later

## Installation

```bash
npm install -g cumulusflow
```

## Creating Your First Project

1. Initialize a new project:
```bash
cumulus install
```

2. Choose your project features:
   - Project name
   - Authentication (Auth0)
   - AI assistance
   - Performance monitoring
   - TypeScript/JavaScript

3. Start development:
```bash
cd your-project
cumulus dev
```

## Project Structure

```
my-app/
├── src/
│   ├── pages/           # Pages and API routes
│   │   ├── index.tsx    # Home page
│   │   └── api/         # Edge functions
│   ├── components/      # Reusable components
│   ├── hooks/           # Custom hooks
│   ├── lib/            # Utilities and helpers
│   └── styles/         # CSS/SCSS files
├── public/             # Static assets
├── tests/             # Test files
└── cumulus.config.ts  # Framework configuration
```

## Key Features

### 1. Edge Functions

```typescript
// src/pages/api/data.ts
import { type EdgeFunction } from 'cumulusflow';

export default function handler: EdgeFunction = async (req) => {
  const data = await fetchData();
  return new Response(JSON.stringify(data));
}
```

### 2. AI Development Assistant

```typescript
// src/components/Form.tsx
import { useAI } from 'cumulusflow/ai';

export function Form() {
  const { analyzeCode, suggestTests } = useAI();
  
  // Get real-time suggestions
  const suggestions = await analyzeCode(`
    // Your code here
  `);
}
```

### 3. Auth0 Integration

```typescript
// src/pages/dashboard.tsx
import { withAuth } from 'cumulusflow/auth';

export default withAuth(function Dashboard({ user }) {
  return <h1>Welcome, {user.name}!</h1>;
});
```

### 4. Performance Monitoring

```typescript
// src/pages/_app.tsx
import { withPerformance } from 'cumulusflow/performance';

export default withPerformance(function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}, {
  metrics: ['FCP', 'LCP', 'CLS'],
  reportTo: 'https://analytics.your-domain.com'
});
```

## Configuration

The `cumulus.config.ts` file controls your project settings:

```typescript
import { defineConfig } from 'cumulusflow/config';

export default defineConfig({
  name: 'my-app',
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID
  },
  ai: {
    enabled: true,
    apiKey: process.env.OPENAI_API_KEY
  },
  performance: {
    monitoring: true,
    budget: {
      LCP: 2500,
      FID: 100,
      CLS: 0.1
    }
  }
});
```

## Deployment

Deploy your application to the edge:

```bash
cumulus deploy
```

## Next Steps

- Explore the [full documentation](https://docs.cumulusflow.dev)
- Join our [Discord community](https://discord.gg/cumulusflow)
- Follow our [tutorial series](https://docs.cumulusflow.dev/tutorials)
- Check out [example projects](https://github.com/movestax/cumulusflow-examples)