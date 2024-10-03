<div align="center">
  <a href="https://goldrush.dev/products/goldrush/"  target="_blank" rel="noopener noreferrer">
    <img alt="GoldRush Kit - powered by Covalent" src="./repo-static/grk-kit-banner.png" style="max-width: 100%;"/>
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

# GoldRush Kit

Beautifully designed React components for your dApp frontend.
200+ Chains. Open-source. Customizable.

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

    > **Note:** If you're using `next.js` versions `^13.0` with the `app` router, make sure you have `use client;` at the top of the file to disable Next's server component modules. Visit GoldRush's [component documentation](https://goldrush.dev/docs/unified-api/goldrush/kit/gold-rush-provider/) for more information.

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

Be sure to secure your apikey to prevent unauthorized use in the GoldRush platform by restricting usage to specific URLs.

```tsx
import {
    GoldRushProvider,
    NFTWalletCollectionList,
    TokenBalancesList,
    TokenTransfersList,
    AddressActivityList,
} from "@covalenthq/goldrush-kit";
import "@covalenthq/goldrush-kit/styles.css";

const GoldRushExample = () => {
    return (
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
    );
};

export default GoldRushExample;
```

## GoldRush Repositories

| Name                                                                             | Description                                                                     |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [TypeScript SDK](https://github.com/covalenthq/covalent-api-sdk-ts)              | The fastest way to integrate the GoldRush API for working with blockchain data. |
| [GoldRush Kit](https://github.com/covalenthq/goldrush-kit)                       | Beautifully designed React components for your dApp frontend.                   |
| [GoldRush Block Explorer](https://github.com/covalenthq/goldrush-block-explorer) | A cross chain block explorer kit that can be customized.                        |
| [GoldRush Decoder](https://github.com/covalenthq/goldrush-decoder)               | Decode unstructured, raw event logs into structured data with a simple API.     |
| [GoldRush RevokeHub](https://github.com/covalenthq/goldrush-revokehub)           | One-stop platform for managing your digital assets securely and efficiently.    |
| [GoldRush Airdrop Assist](https://github.com/covalenthq/goldrush-airdrop-assist) | Effortlessly filter and find all valid addresses for your next airdrop.         |

## Build and customize with Storybook

The components used above are built with `ReactJS` and `TailwindCSS`, using `TypeScript`. You can preview and customize the components using [Storybook](https://storybook.js.org/).

1. **Setup Environmental Variables**: Create and add a `.env` file to the root directory of your project and the listed values from [.env.example](./.env.example) following to the file.

    ```
    STORYBOOK_GOLDRUSH_API_KEY = "<YOUR_API_KEY>"
    ```

2. **Start development server**

    ```bash
    npm run dev
    ```

3. **Build/Bundle Component Library**

    ```bash
    npm run build:library
    ```

4. **Build/Bundle Storybook**

    ```bash
    npm run build:storybook
    ```

## Contributing

Contributions, issues and feature requests are welcome!
Feel free to check [issues](https://github.com/covalenthq/goldrush-kit/issues) page.

## Show your support

Give a ⭐️ if this project helped you!

## License

This project is [Apache-2.0](./LICENSE) licensed.
