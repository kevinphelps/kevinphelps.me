export const environment = {
  production: true,
  serverPort: typeof window === 'undefined' ? process.env.PORT || 5000 : undefined,
  api: typeof window === 'undefined' ? 'http://localhost:1114/api' : '/api',
};
