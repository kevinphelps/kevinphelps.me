import { compose } from '@ngrx/core/compose';
import { combineReducers, Action, ActionReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from './../../../environments/environment';
import { blogReducer } from './blog/blog.reducer';
import { BlogState } from './blog/blog.state';

export interface AppState {
  blog: BlogState;
}

const reducers = {
  blog: blogReducer
};

const developmentReducer: ActionReducer<AppState> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<AppState> = combineReducers(reducers);

const renderedState = environment.browser ? (window as any)._state : undefined;
export const initialState = renderedState ? renderedState : productionReducer(undefined, { type: undefined });

export function reducer(state = initialState, action: Action) {
  if (environment.production) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}
