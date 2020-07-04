/* eslint @typescript-eslint/ban-ts-comment: off */
/* eslint @typescript-eslint/no-non-null-assertion: off */

import {
  SetStateAction,
  useCallback,
  // @ts-ignore
  useMutableSource,
} from 'react';

import type { Atom } from './createAtom';

export function useAtom<State>(
  atom: Atom<State, unknown>,
): [State, (u: SetStateAction<State>) => void];

export function useAtom<State, StateKey extends keyof State>(
  atom: Atom<State, unknown>,
  stateKey: StateKey
): [State[StateKey], (u: SetStateAction<State[StateKey]>) => void];

/**
 * use atom
 *
 * a custom hook that works like React.useState
 *
 * @example
 * import { createAtom, useAtom } from 'react-hooks-global-state';
 *
 * const atom = createAtom({ count: 0 });
 *
 * const Component = () => {
 *   const [count, setCount] = useAtom(atom, 'count');
 *   ...
 * };
 */
export function useAtom<State>(
  atom: Atom<State, unknown>,
  stateKey?: keyof State,
) {
  const getSnapshot = useCallback((a: Atom<State, unknown>) => {
    if (stateKey) {
      return a.getStateByKey(stateKey);
    }
    return a.getState();
  }, [stateKey]);
  const subscribe = useCallback((a: Atom<State, unknown>, callback: () => void) => {
    const unsubscribe = a.subscribe(stateKey || null, callback);
    return unsubscribe;
  }, [stateKey]);
  const state = useMutableSource(atom.mutableSource, getSnapshot, subscribe);
  const updater = useCallback((u: SetStateAction<State | State[keyof State]>) => {
    if (stateKey) {
      atom.setStateByKey(stateKey, u as SetStateAction<State[keyof State]>);
    } else {
      atom.setState(u as SetStateAction<State>);
    }
  }, [atom, stateKey]);
  return [state, updater] as const;
}
