# Change Log

## [Unreleased]

## [2.1.0] - 2022-12-04
### Added
- expose "subscribe" function for "createGlobalState" #85

## [2.0.0] - 2022-08-05
### Changed from 2.0.0-rc.0
- Depends on zustand v4.0.0

## [2.0.0-rc.0] - 2022-05-28
### Changed
- Re-implemented with zustand as a dependency
- `createStore` returns `useStoreState`
  - `useGlobalState` returned by `createStore` is deprecated
### Removed
- BREAKING CHANGE: drop reduxDevToolsExt

## [1.0.2] - 2021-08-14
### Changed
- Fix package.json properly for ESM

## [1.0.1] - 2020-07-04
### Changed
- Modern build

## [1.0.0] - 2020-02-18
### Added
- More tests
### Changed
- Improve naming: stateKey

## [1.0.0-alpha.2] - 2020-01-25
### Changed
- Migration to TypeScript (#36)
  - BREAKING CHANGE: reduxDevToolsExt is now in index

## [1.0.0-alpha.1] - 2020-01-24
### Changed
- New API without context (#35)
  - BREAKING CHANGE: No longer GlobalStateProvider required

## [0.17.0] - 2020-01-09
### Changed
- Support state branching (#31)

## [0.16.0] - 2019-10-22
### Changed
- Improve typings with React types

## [0.15.0] - 2019-09-25
### Changed
- Remove not-in-render warning in getGlobalState (#26)

## [0.14.0] - 2019-06-15
### Changed
- Better error message for missing GlobalStateProvider

## [0.13.0] - 2019-06-11
### Added
- Check name availability in runtime (DEV only)
### Changed
- Update devDependencies

## [0.12.0] - 2019-06-07
### Changed
- Proper GlobalStateProvider type
### Added
- Add getGlobalState function

## [0.11.0] - 2019-05-25
### Changed
- Fix failing to update state during initialization

## [0.10.0] - 2019-05-25
### Changed
- Trick to support react-hot-loader

## [0.9.0] - 2019-03-18
### Changed
- Better typings for optional initialState

## [0.8.0] - 2019-03-16
### Changed
- Experimental support for eliminating initialState
- Copied devtools.d.ts into the dist folder

## [0.7.0] - 2019-02-11
### Changed
- Fixed type definition of CreateGlobalState
- Eliminated React warning for using unstable_observedBits

## [0.6.0] - 2019-02-07
### Changed
- Updated Dependencies (react 16.8)

## [0.5.0] - 2019-01-26
### Changed
- AnyEnhancer type hack for Redux

## [0.4.0] - 2018-12-03
### Changed
- Fix Initialization bug (#2)

## [0.3.0] - 2018-11-12
### Changed
- New API using Context and observedBits

## [0.2.0] - 2018-11-09
### Changed
- Hacky/dirty Redux DevTools Extension support
- Fix type definition

## [0.1.0] - 2018-11-07
### Changed
- API changed to useGlobalState/setGlobalState

## [0.0.5] - 2018-11-06
### Changed
- Store enhancer support

## [0.0.4] - 2018-11-05
### Changed
- Redux-like createStore
- Update README

## [0.0.3] - 2018-11-04
### Added
- Reducer support

## [0.0.2] - 2018-10-30
### Changed
- Update README

## [0.0.1] - 2018-10-28
### Added
- Initial experimental release
