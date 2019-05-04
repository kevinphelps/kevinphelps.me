import { InjectionToken } from '@angular/core';

export type IsPrerenderingFunction = () => boolean;

export const IS_PRERENDERING = new InjectionToken<IsPrerenderingFunction>('IS_PRERENDERING');
