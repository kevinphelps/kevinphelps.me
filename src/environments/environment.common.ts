const node = typeof window === 'undefined';
const serverPort = node ? process.env.PORT || 5000 : undefined;

export const commonEnvironment = {
  node,
  browser: node === false,
  serverPort,
  api: node ? `http://localhost:${serverPort}/api` : '/api'
};
