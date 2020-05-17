import { SetStateAction } from 'react';
import type { Atom } from './createAtom';
export declare function useAtom<State>(atom: Atom<State, unknown>): [State, (u: SetStateAction<State>) => void];
export declare function useAtom<State, StateKey extends keyof State>(atom: Atom<State, unknown>, stateKey: StateKey): [State[StateKey], (u: SetStateAction<State[StateKey]>) => void];
