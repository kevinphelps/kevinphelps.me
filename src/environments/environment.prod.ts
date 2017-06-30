import { commonEnvironment } from './environment.common';

export const prodEnvironment = {
  production: true
};

export const environment = { ...commonEnvironment, ...prodEnvironment };
