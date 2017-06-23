const node = typeof window === 'undefined';
const serverPort = node ? process.env.PORT || 5000 : undefined;
const serverRoot = node ? `http://localhost:${serverPort}` : '';

export const commonEnvironment = {
  node,
  browser: node === false,
  serverPort,
  serverRoot,
  api: `${serverRoot}/api`
};
