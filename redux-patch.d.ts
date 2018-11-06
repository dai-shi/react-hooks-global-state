import {
  Dispatch as MyDispatch,
  Enhancer as MyEnhancer,
  Store as MyStore,
} from './src';

declare module 'redux' {
  type MyMiddleware<S, A> = (store: MyStore<S, A>) =>
    (next: MyDispatch<A>) => (action: A) => A;
  function applyMiddleware<S, A>(...args: Array<MyMiddleware<S, A>>): MyEnhancer<S, A>;
}
