<div align="center">
  <a href="https://goldrush.dev/products/goldrush/"  target="_blank" rel="noopener noreferrer">
    <img alt="GoldRush Kit - powered by Covalent" src="./src/static/grk-kit-banner.png" style="max-width: 100%;"/>
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
  <img src="https://img.shields.io/github/license/covalenthq/goldrush-kit" alt="Apache-2.0">
</p>

<h1 align="center">
    Beautifully designed React components for your dApp frontend.
</h1>

<div align="center">
    200+ Chains. Open-source. Customizable.
</div>

<p align="center">
    <br />
    <a href="https://goldrush.dev/docs/unified-api/goldrush/kit/gold-rush-provider/" rel="dofollow">
        <strong>Explore the docs »</strong>
    </a>
    <br />
</p>

## Setup

Install `goldrush-kit` using `npm`:

```bash
npm install @covalenthq/goldrush-kit
```

## Implementation

1. Import `GoldRushProvider`

```tsx
import { GoldRushProvider } from "@covalenthq/goldrush-kit";
```

2. Wrap `GoldRushProvider` around the application.
3. Configure the provider and add it to the `apikey` props with your GoldRush API key. You can register for a free key on [GoldRush's website](https://goldrush.dev/platform/apikey).

    > **Note:** You should always keep your API key private, never put it directly into your code, especially front end code. Instead, use an environment variable to inject the key into your code.

```tsx
<GoldRushProvider apikey="<YOUR_API_KEY>">{children}</GoldRushProvider>
```

4. Add the stylesheet to your application.

```tsx
import "@covalenthq/goldrush-kit/styles.css";
```

5. Add desired components.
    > **Note:** If you're using `next.js` versions `^13.0` and are using `app` router, make sure you have `use client;` at the top of the file to disable Next's server component modules. Visit GoldRush's [component documentation](https://goldrush.dev/docs/unified-api/goldrush/kit/gold-rush-provider/) for more information.

```tsx
import {
    GoldRushProvider,
    NFTWalletCollectionList,
    TokenBalancesList,
    TokenTransfersList,
    AddressActivityList,
} from "@covalenthq/goldrush-kit";
```

## Ready-to-go React Component example

Here's a full example to get you started.

Be sure to secure your key to prevent unauthorized use in the GoldRush platform by restricting usage to specific URLs.

```tsx
"use client";

import "@covalenthq/goldrush-kit/styles.css";
import {
    GoldRushProvider,
    NFTWalletCollectionList,
    TokenBalancesList,
    TokenTransfersList,
    AddressActivityList,
} from "@covalenthq/goldrush-kit";

const GoldRushExample = () => {
    return (
        <main className="">
            <GoldRushProvider
                apikey={process.env.NEXT_PUBLIC_API_KEY}
                theme={{
                    borderRadius: 6,
                    colors: {
                        dark: {
                            primary: "#FF4C8B",
                            background: "#000426",
                            foreground: "#FFFFFF",
                            secondary: "#868E96",
                        },
                        light: {
                            primary: "#00D8D5",
                            background: "#FFFFFF",
                            foreground: "#1C2024",
                            secondary: "#868E96",
                        },
                    },
                    mode: "dark",
                }}
            >
                <TokenBalancesList
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

                <TokenTransfersList
                    chain_name="eth-mainnet"
                    address="0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de"
                    contract_address="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
                />

                <AddressActivityList address="0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de" />

                <NFTWalletCollectionList
                    address="0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de"
                    chain_name="eth-mainnet"
                />
            </GoldRushProvider>
        </main>
    );
};

export default GoldRushExample;
```

## GoldRush Templates

| Template                              | Description                                              | Link                                                       |
| ------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| Wallet & Portfolio UI                 | Display your tokens and NFTs across multiple chains.     | https://github.com/covalenthq/goldrush-wallet-portfolio-ui |
| NFT Collection Gallery & Analytics UI | Display NFTs by collection and see their details.        | https://github.com/covalenthq/goldrush-nft-gallery-ui      |
| Transaction Receipt View              | A beautifully designed view for blockchain transactions. | https://github.com/covalenthq/goldrush-tx-receipt-ui       |

## HIGHLIGHT: GoldRush Transaction Receipt View

Designed to transform cluttered blockchain transaction data into meaningful summaries useful to the user. Receipts are fully extensible and enhance the clarity and understanding of various blockchain activities. Imagine a transaction view that shows Game-Fi quest achievements, swap pool position data, or even staking impact on network security—this is all possible with GoldRush-Kit.

https://goldrush-tx-receipt-ui.vercel.app/

https://github.com/covalenthq/goldrush-tx-receipt-ui

## GoldRush Decoder

Decode transaction log events to display them in a human-readable format. Useful for understanding the data that is emitted from smart contracts and is a critical component of any dApp. Works in tandem with GoldRush-Kit to provide a seamless experience for developers and users alike.

https://github.com/covalenthq/goldrush-decoder

## Build and customize with Storybook

The components used above are built React, Tailwind, and TypeScript. You can preview and customize the components using Storybook.

Storybook provides developers with a way to quickly prototype and develop components in isolation, while React provides the tools to quickly build out a web application. Tailwind provides a library of pre-built UI components and utility classes, while TypeScript adds type safety and autocompletion to the development process. Together, these tools provide developers with the tools they need to quickly and easily build complex, modern web applications.

### Storybook Environmental Variable

Create and add a `.env` file to the root directory of your project and the following to the file.

```
STORYBOOK_GOLDUSH_API_KEY = "<YOUR_API_KEY>"
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

This project is [Apache-2.0](./LICENSE) licensed.
