import * as React from 'react';

declare module 'react' {
  function useEffect(
    create: () => void | (() => void),
    inputs?: ReadonlyArray<unknown>,
  ): void;
}
