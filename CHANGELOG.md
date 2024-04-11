# Changelog for Covalent GoldRush Kit

## 0.5.2

**Fixes**

-   Fix bundle size
-   Fix logic of selection of theme to be applied
-   Update dependencies and remove dead packages
-   Fix GitHub Actions workflow conditions

**Features**

-   Add `BlockTransactions` Organism
-   `TransactionsList` is now deprecated and replaced with `AddressTransactions`

## 0.5.1

**Fixes**

-   Fix search function exported from `useGoldRush`
-   Update TypeScript Client SDK
-   Fix exported components TypeScript support for props
-   Fix `prettyToken` implementation

## 0.5.0

**Fixes**

-   Fix `image_512` null check error
-   Fix TypeScript types - remove use of `any` type
-   Fix exported components for the library

**Features**

-   Themeing is updated to a new implementation

## 0.4.7

**Fixes**

## Fixes

-   Fix transactions receipt responsiveness
-   Fix copy toast for address copy

## Features

-   Add block details v2

## 0.4.6

**Fixes**

## Fixes

-   Type exporting for components
-   Transaction receipt token image by handling svg or png
-   Token detail error checks
-   Delta display on no price change

## 0.4.5

**Fixes**

## Fixes

-   Refactor provider
-   Fix quote rate being 0 on token pool list component
-   Fix swap exchange logic

-   Refactor provider
-   Fix quote rate being 0 on token pool list component
-   Fix swap exchange logic

**Features**

## 0.4.4

**Fixes**

## Fixes

-   Fix decoder api body
-   Detailed keys for Decoder

-   Fix decoder api body
-   Detailed keys for Decoder

**Features**

## 0.4.3

**Fixes**

## Fixes

-   Mobile `on_click` fix

## Features

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

## Features

-   Add transfer clicks to labels on list views
    -   PoolList
    -   TokenList
    -   TokenPoolList
    -   WalletPoolList
    -   WalletPositions

## 0.4.1

**Fixes**

**Features**

## Features

-   Add `chain_name` to the object when `on_transfer_click` function is ran on the `TokenBalanceListView` component.

## 0.4.0

**Fixes**

## Fixes

-   Fix hydration error for Transactions Receipt

## Features

-   Added Address Detail View component

## 0.3.9

**Fixes**

## Fixes

-   Forward apikey in context for transactions receipt fix
-   Fix skeleton for transactions receipt

## Features

-   Added new gas card

## 0.3.8

**Fixes**

## Fixes

-   Fixed image in README
-   Added user agent
-   Remove unnecessary checkboxes in list components

-   Fixed image in README
-   Added user agent
-   Remove unnecessary checkboxes in list components

**Features**

### Block Explorer Components

-   Transactions receipt

## 0.3.7

**Fixes**

## Fixes

-   Added pagination to token list and pool list views
-   Cache SVGs for token icons
-   Consistent stories

-   Added pagination to token list and pool list views
-   Cache SVGs for token icons
-   Consistent stories

**Features**

### XYK Components

-   Wallet positions

## 0.3.6

**Fixes**

## Fixes

-   Added pagination to token list and pool list views
-   Cache SVGs for token icons
-   Consistent stories

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
