const node = typeof window === 'undefined';

export const commonEnvironment = {
  node,
  browser: node === false,
  serverPort: node ? 4000 : undefined,
  httpRequestRoot: node ? `http://localhost:4000` : '',
  production: false
};
