import { commonEnvironment } from './environment.common';

export const devEnvironment = {
  production: false
};

export const environment = { ...commonEnvironment, ...devEnvironment };
