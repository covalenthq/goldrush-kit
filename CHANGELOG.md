# Changelog for Covalent GoldRush Kit

## 0.4.3

## What's Changed

## Fixes
- Mobile `on_click` fix

## Features
- Components
    - Block Details
    - Chain Selector
    - Transactions List
- Additions
    - on clicks added to transaction list components that returns row data.
        - `on_transfer_click` - When user clicks the transaction label, the function returns the row data
        - `on_goldrush_receipt_click` - Renders button on row, the function returns the row data
        - `on_native_explorer_click` - Renders button on row, the function returns the row data

## 0.4.2

## What's Changed

## Fixes

## Features
- Add transfer clicks to labels on list views
    - PoolList
    - TokenList
    - TokenPoolList
    - WalletPoolList
    - WalletPositions

## 0.4.1

## What's Changed

## Fixes

## Features
- Add `chain_name` to the object when `on_transfer_click` function is ran on the `TokenBalanceListView` component.

## 0.4.0

## What's Changed

## Fixes
- Fix hydration error for Transactions Receipt

## Features
- Added Address Detail View component

## 0.3.9

## What's Changed

## Fixes
- Forward apikey in context for transactions receipt fix
- Fix skeleton for transactions receipt

## Features
- Added new gas card

## 0.3.8

## What's Changed

## Fixes
- Fixed image in README
- Added user agent
- Remove unnecessary checkboxes in list components

## Features

### Block Explorer Components
- Transactions receipt

## 0.3.7

## What's Changed

## Fixes
- Added pagination to token list and pool list views
- Cache SVGs for token icons
- Consistent stories

## Features

### XYK Components
- Wallet positions

## 0.3.6

## What's Changed

## Fixes
- Added pagination to token list and pool list views
- Cache SVGs for token icons
- Consistent stories

## Features

### XYK Components
- Token list
- Pool list
- Token transactions
- Pool transactions
- Wallet transactions
- Token detail
- Pool detail