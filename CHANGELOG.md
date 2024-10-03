# Changelog for GoldRush Kit

## 1.0.2

**Fixes**

-   Build issues caused by `cva`

## 1.0.1

**Fixes**

-   Gas Card active state
-   Build issues caused by `cva`

## 1.0.0

**Features**

-   Rebranded to GoldRush APIs
-   Updated `README.md`, `LICENSE`, and more documents
-   Upgraded to latest changes from the GoldRush TS SDK
-   Pruned dead theme code
-   Pruned deprecated endpoints

## 0.6.5

**Features**

-   Exported types of the entire project
-   Removed deprecated exports
-   Update `AddressAvatar` render options for its usage
-   Update `TokenAvatar` for clearer usage
-   Update `NFTWalletCollectionList` UI
-   Added `autodocs` for stories

**Fixes**

-   Fix value parsing in multiple places
-   Fix theme colors in `TokenAvatar`
-   Fix table wrapping
-   Fix toasts
-   Create `AddressAvatar` types enum
-   `actionables` of multiple components
-   Misc DX fixes
-   Misc HTML element nesting
-   Prune unnecessary static assets

## 0.6.4

**Features**

-   Updated `GasCard` UI
-   Added optional `TokenAvatar` to `Address`
-   Added Chain logo to `ChainSelector`
-   Revoke functionality for Approvals list

**Fixes**

-   Default theme colors
-   Misc UI/UX involving usage of Cards, padding, borders, colors, Badges
-   Dynamic `Timestamp` lag on switch
-   Empty `chain_options` for `ChainSelector`
-   Theme based Scrollbar CSS
-   Unnecessary element nesting in tables
-   Misc responsiveness

## 0.6.3

**Features**

-   Added `dynamic` property to `Timestamp`
-   Updated `GasCard` UI

**Fixes**

-   Removed Table Header Sorting for Approvals List
-   Value calculation in multiple places
-   `actions` for `BlocksList` and `LatestBlocks`

## 0.6.2

**Features**

-   Added actions for interlinking components

## 0.6.1

**Features**

-   Added `TokenApprovalList` and `NFTApprovalList` Molecules
-   Added `BlocksList` and `TransactionsList` Molecules
-   `ChainSelector` now accepts ChainsIDs alongside ChainNames
-   Updated UI for `LatestBlocks` and `LatestTransactions`

**Fixes**

-   TransactionList misaligned props
-   `Timestamp` UI
-   `Address` and `AddressCard` utilization

## 0.6.0

**Features**

-   All the Organisms have been broken down to properly grouped molecules
-   Added `Timestamp` Atom

**Fixes**

-   Responsiveness of multiple components
-   Visual uniformity
-   DRY Code

## 0.5.6

**Features**

-   Added `LatestTransactions` for a chain

**Fixes**

-   Responsiveness of multiple components
-   Added visual uniformity
    -   Created for `CardDetail` for all heading-value based data pairs
    -   Created `TableList` for all the tables
    -   Refactored for pagination in `TableList` to improve visual similarity
-   Fixed build for Storybook
-   Fixed columns in all the tables
-   Improved TypeScript support

## 0.5.5

**Features**

-   Added `LatestPrice` for native token molecule
-   Added `custom_avatar` for `Address`
-   Updated UI for `GasCard`

**Fixes**

-   Initial state of `ChainSelector`
-   `AddressDetails` token holdings dropdown height
-   CSS in `AddressDetails`, `BlockDetails` and `TransactionDetails`
-   Loading state for list of transactions
-   Misc CSS

## 0.5.4

**Fixes**

-   Migrated `AddressDetails` as a Molecule instead of an Organism
-   Removed `ChainSelector` from `AddressDetails`
-   Fixed `LatestBlocks` for `height` parameter and improve CSS

**Features**

-   Added `chain_options` for `ChainSelector` to limit options as per need
-   Added a loader skeleton for `ChainSelector`

## 0.5.3

**Fixes**

-   Fixed themeing and CSS inconsistencies across all components
-   Pruned dead code and dependencies
-   Fixed Typescript and linting warnings at multiple places

**Features**

-   Updated all dependencies like eslint, storybook, shadcn and more
-   Added chromatic for internal UI auditing
-   Added `LatestBlocks` component
-   Added `TransactionDetails` component

## 0.5.2

**Fixes**

-   Fixed bundle size
-   Fixed logic of selection of theme to be applied
-   Updated dependencies and remove dead packages
-   Fixed GitHub Actions workflow conditions

**Features**

-   Added `BlockTransactions` Organism
-   Deprecated `TransactionsList` with `AddressTransactions`

## 0.5.1

**Fixes**

-   Fixed search function exported from `useGoldRush`
-   Updated TypeScript Client SDK
-   Fixed exported components TypeScript support for props
-   Fixed `prettyToken` implementation

## 0.5.0

**Fixes**

-   Fixed `image_512` null check error
-   Fixed TypeScript types - remove use of `any` type
-   Fixed exported components for the library

**Features**

-   Updated themeing to a new implementation

## 0.4.7

**Fixes**

-   Fixed transactions receipt responsiveness
-   Fixed copy toast for address copy

**Features**

-   Added block details v2

## 0.4.6

**Fixes**

-   Types and Props exports for components
-   Transaction receipt token image by handling svg or png
-   Token detail error checks
-   Delta display on no price change

## 0.4.5

**Fixes**

-   Refactored GoldRush Provider
-   Fixed `quote_rate` being 0 on `TokenPoolList`
-   Fixed swap exchange logic

**Features**

## 0.4.4

**Fixes**

-   Fixed decoder api body
-   Detailed keys for Decoder

**Features**

## 0.4.3

**Fixes**

-   Mobile `on_click` fix

**Features**

-   Components
    -   Block Details
    -   Chain Selector
    -   Transactions List
-   Additions
    -   on clicks added to transaction list components that returns row data.
        -   `on_transfer_click` - When user clicks the transaction label, the function returns the row data
        -   `on_goldrush_receipt_click` - Renders button on row, the function returns the row data
        -   `on_native_explorer_click` - Renders button on row, the function returns the row data

## 0.4.2

**Fixes**

**Features**

-   Add transfer clicks to labels on list views
    -   PoolList
    -   TokenList
    -   TokenPoolList
    -   WalletPoolList
    -   WalletPositions

## 0.4.1

**Fixes**

**Features**

-   Add `chain_name` to the object when `on_transfer_click` function is ran on the `TokenBalanceListView` component.

## 0.4.0

**Fixes**

-   Fix hydration error for Transactions Receipt

**Features**

-   Added Address Detail View component

## 0.3.9

**Fixes**

-   Forward apikey in context for transactions receipt fix
-   Fix skeleton for transactions receipt

**Features**

-   Added new gas card

## 0.3.8

**Fixes**

-   Fixed image in README
-   Added user agent
-   Remove unnecessary checkboxes in list components

**Features**

### Block Explorer Components

-   Transactions receipt

## 0.3.7

**Fixes**

-   Added pagination to token list and pool list views
-   Cache SVGs for token icons
-   Consistent stories

**Features**

### XYK Components

-   Wallet positions

## 0.3.6

**Fixes**

-   Added pagination to token list and pool list views
-   Cache SVGs for token icons
-   Consistent stories

**Features**

### XYK Components

-   Token list
-   Pool list
-   Token transactions
-   Pool transactions
-   Wallet transactions
-   Token detail
-   Pool detail
