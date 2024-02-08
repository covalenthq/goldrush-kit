<div align="center">
  <a href="https://www.covalenthq.com/products/goldrush/" target="_blank">
    <img alt="GoldRush Kit Logo" src="https://raw.githubusercontent.com/covalenthq/goldrush-kit/main/src/static/grk-kit-banner.png" style="max-width: 100%;"/>
  </a>
</div>

<br/>

<p align="center">
  <a href="https://www.npmjs.com/package/@covalenthq/goldrush-kit">
    <img src="https://img.shields.io/npm/v/@covalenthq/goldrush-kit" alt="NPM">
  </a>
  <a href="https://www.npmjs.com/package/@covalenthq/goldrush-kit">
    <img src="https://img.shields.io/npm/dm/@covalenthq/goldrush-kit" alt="npm downloads">
  </a>
  <img src="https://img.shields.io/github/license/covalenthq/goldrush-kit" alt="MIT">
</p>

<h1 align="center">Beautifully designed React components for your dApp frontend.</h1>

<div align="center">
200+ Chains. Open-source. Customizable.
</div>
  <p align="center">
    <br />
    <a href="https://www.covalenthq.com/docs/unified-api/goldrush/kit/gold-rush-provider/" rel="dofollow"><strong>Explore the docs »</strong></a>
    <br />
</p>
<p align="center">
  <br />
    Read this in other languages: <a href="https://github.com/covalenthq/goldrush-kit/blob/main/README.hi.md">हिंदी</a>
  </p>

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

5. Add desired components. If you're using `next.js` versions `^13.0` and are using `app` router, make sure you have `use client;` at the top of the file to disable Next's server component modules. Visit GoldRush's [component documentation](https://www.covalenthq.com/docs/unified-api/goldrush/kit/gold-rush-provider/) for more information.

```tsx
import {
    GoldRushProvider,
    NFTWalletTokenListView,
    TokenBalancesListView,
    TokenTransfersListView,
    AddressActivityListView,
} from "@covalenthq/goldrush-kit";
```

## Ready-to-go React Component example

Here's a full example to get you started. If you're using `next.js` versions `^13.0` and are using `app` router, make sure you have `use client;` at the top of the file to disable Next's server component modules.

**Note:** You should always keep your API key private, never put it directly into your code, especially front end code. Instead, use an environment variable to inject the key into your code.

Be sure to secure your key to prevent unauthorized use in the Covalent platform by restricting usage to specific URLs.

```tsx
"use client";
import "@covalenthq/goldrush-kit/styles.css";
import {
    GoldRushProvider,
    NFTWalletTokenListView,
    TokenBalancesListView,
    TokenTransfersListView,
    AddressActivityListView,
} from "@covalenthq/goldrush-kit";

export default function GoldRushExample() {
    return (
        <main className="">
            <GoldRushProvider
                apikey={process.env.NEXT_PUBLIC_API_KEY}
                mode="dark"
                color="emerald"
            >
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
                <AddressActivityListView address="0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de" />
                <NFTWalletTokenListView
                    address="0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de"
                    chain_names={[
                        "eth-mainnet",
                        "matic-mainnet",
                        "bsc-mainnet",
                        "avalanche-mainnet",
                        "optimism-mainnet",
                    ]}
                />
            </GoldRushProvider>
        </main>
    );
}
```

## GoldRush Templates

| Template                              | Description                                          | Link                                                       |
| ------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| Wallet & Portfolio UI                 | Display your tokens and NFTs across multiple chains. | https://github.com/covalenthq/goldrush-wallet-portfolio-ui |
| NFT Collection Gallery & Analytics UI | Display NFTs by collection and see their details.    | https://github.com/covalenthq/goldrush-nft-gallery-ui      |
| Uniswap-like Analytics UI             | Coming soon!                                         |                                                            |

## Build and customize with Storybook

The components used above are built React, Tailwind, and TypeScript. You can preview and customize the components using Storybook.

Storybook provides developers with a way to quickly prototype and develop components in isolation, while React provides the tools to quickly build out a web application. Tailwind provides a library of pre-built UI components and utility classes, while TypeScript adds type safety and autocompletion to the development process. Together, these tools provide developers with the tools they need to quickly and easily build complex, modern web applications.

### Storybook Environmental Variable

Create and add a `.env` file to the root directory of your project and the following to the file.

```
STORYBOOK_COVALENT_API_KEY = "<YOUR_API_KEY>"
```

### Start

```bash
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

## Contributing

Contributions, issues and feature requests are welcome!
Feel free to check <a href="https://github.com/covalenthq/goldrush-kit/issues">issues</a> page.

## Show your support

Give a ⭐️ if this project helped you!

## License

This project is <a href="https://github.com/covalenthq/goldrush-kit/blob/main/LICENSE">Apache 2.0</a> licensed.
