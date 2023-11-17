# goldrush-kit

Beautifully designed React components for your dApp frontend. 200+ Chains. Open-source. Customizable.

## Setup

Install `goldrush-kit` using `npm`:

```bash
npm install @covalenthq/goldrush-kit
```

or `yarn`:

```bash
yarn add @covalenthq/goldrush-kit
```

## Implementation

1. Import `GoldRushProvider`

```tsx
import { GoldRushProvider } from "@covalenthq/goldrush-kit";
```

2. Wrap `GoldRushProvider` around the application.
3. Configure the provider and add it to the `apikey` props with your Covalent API key. You can register for a free key on [Covalent's website](https://www.covalenthq.com).

```tsx
<GoldRushProvider apikey="<YOUR_API_KEY>">{children}</GoldRushProvider>
```

4. Add the stylesheet to your application.

```tsx
import "@covalenthq/goldrush-kit/styles.css";
```

5. Add desired components. Visit GoldRush's [component documentation](https://www.covalenthq.com/docs/unified-api/goldrush/kit/gold-rush-provider/) for more information.

```tsx
import {
    GoldRushProvider,
    NFTWalletTokenListView,
    TokenBalancesListView,
    TokenTransfersListView,
    AddressActivityListView,
} from "@covalenthq/goldrush-kit";
```

## Ready-to-go example

Here's a full example that you can copy-paste to get started.

```tsx
<GoldRushProvider apikey="<YOUR_API_KEY>" mode="dark" color="emerald">
    <TokenBalancesListView
        chain_names={[
            "eth-mainnet",
            "matic-mainnet",
            "bsc-mainnet",
            "avalanche-mainnet",
            "optimism-mainnet",
        ]}
        hide_small_balances
        address="0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de"
    />
    <TokenTransfersListView
        chain_name="eth-mainnet"
        address="0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de"
        contract_address="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    />
    <AddressActivityListView address="0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de"/>
    <NFTWalletTokenListView
        address="0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de"
        chain_name="eth-mainnet"
    />
</GoldRushProvider>
```

## Build and customize with Storybook

The components used above are built using Storybook, React, Tailwind, and TypeScript.

Storybook provides developers with a way to quickly prototype and develop components in isolation, while React provides the tools to quickly build out a web application. Tailwind provides a library of pre-built UI components and utility classes, while TypeScript adds type safety and autocompletion to the development process. Together, these tools provide developers with the tools they need to quickly and easily build complex, modern web applications.

### Environmental Variable

Create and add a `.env` file to the root directory of your project and the following to the file.  

```
STORYBOOK_COVALENT_API_KEY = "YOUR_API_KEY"
```

### Start

```
npm run dev
```

### Build/Bundle Component Library

```bash
npm run build:library
```

### Build/Bundle Storybook For Deployment

```bash
npm run build:storybook
```
