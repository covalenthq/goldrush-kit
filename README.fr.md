<div align="center">
  <a href="https://www.covalenthq.com/products/goldrush/" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/covalenthq/goldrush-kit/main/src/static/goldrush-kit-logo.png">
    <img alt="GoldRush Kit Logo" src="https://raw.githubusercontent.com/covalenthq/goldrush-kit/main/src/static/goldrush-kit-logo.png" width="280"/>
  </picture>
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

<h1 align="center">Des composants React parfaitement conçus pour le frontend de vos dApps.</h1>

<div align="center">
200+ Chains. Open-source. Personnalisable.
</div>

  <p align="center">
    <br />
    <a href="https://www.covalenthq.com/docs/unified-api/goldrush/kit/gold-rush-provider/" rel="dofollow"><strong>Explorer la documentation »</strong></a>
    <br />
</p>

## Installation

Installer `goldrush-kit` avec `npm` :

```bash
npm install @covalenthq/goldrush-kit
```

ou avec `yarn`:

```bash
yarn add @covalenthq/goldrush-kit
```

## Implémentation

1. Importer `GoldRushProvider`

```tsx
import { GoldRushProvider } from "@covalenthq/goldrush-kit";
```
2. Insérer `GoldRushProvider` autour de l'application.
3. Configurer le composant GoldRushProvider en y ajoutant l'attribut `apikey` avec votre clé API Covalent. Vous pouvez vous enregistrer pour une clé gratuite sur [le site web de Covalent](https://www.covalenthq.com).

```tsx
<GoldRushProvider apikey="<VOTRE_CLE_API>">{children}</GoldRushProvider>
```

4. Importer la feuille de style à votre application.

```tsx
import "@covalenthq/goldrush-kit/styles.css";
```

5. Ajouter les composants désirés. Si vous utilisez `next.js` versions `^13.0` et utilisez le routeur `app`, assurez-vous que vous avez `use client;` en haut du fichier pour désactiver les modules du composant serveur de Next. Visitez la [documentation des composants de GoldRush](https://www.covalenthq.com/docs/unified-api/goldrush/kit/gold-rush-provider/) pour plus d'informations.

```tsx
import {
    GoldRushProvider,
    NFTWalletTokenListView,
    TokenBalancesListView,
    TokenTransfersListView,
    AddressActivityListView,
} from "@covalenthq/goldrush-kit";
```

## Exemple de composant React prêt à l'emploi

Voici un exemple complet pour vous aider à démarrer. Si vous utilisez `next.js` versions `^13.0` et utilisez le routeur `app`, assurez-vous d'avoir `use client;` en haut du fichier pour désactiver les modules du composant serveur de Next.

**Note:** Vous devez toujours garder votre clé d'API privée, ne jamais l'insérer directement dans votre code, en particulier dans le code du front-end. Utilisez plutôt une variable d'environnement pour injecter la clé dans votre code.

Veillez à sécuriser votre clé afin d'éviter toute utilisation non autorisée sur Covalent en limitant son utilisation à des URL spécifiques.

```tsx
// 'use client';
// Si vous utilisez Next.js, placez votre clé API dans un fichier .env.local
<GoldRushProvider
    apikey={process.env.VOTRE_CLE_API}
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
```

## Modèles GoldRush

| Modèles                                | Description                                         | Lien                                                       |
|----------------------------------------|-----------------------------------------------------| ---------------------------------------------------------- |
| Wallet & Portfolio UI                  | Affichez vos tokens et NFT sur plusieurs chaînes.   | https://github.com/covalenthq/goldrush-wallet-portfolio-ui |
| NFT Collection Gallery & Analytics UI  | Bientôt disponible !                                |                                                            |
| Uniswap-like Analytics UI              | Bientôt disponible !                                |                                                            |

## Créer et personnaliser avec Storybook

Les composants utilisés ci-dessus sont construits en React, Tailwind et TypeScript. Vous pouvez prévisualiser et personnaliser les composants en utilisant Storybook.

Storybook offre aux développeurs un moyen de prototyper et de développer rapidement des composants de manière isolée, tandis que React fournit les outils nécessaires à la construction rapide d'une application web. Tailwind fournit une bibliothèque de composants d'interface utilisateur et de classes utilitaires préconstruits, tandis que TypeScript ajoute la sécurité des types et l'autocomplétion au processus de développement. Ensemble, ces outils fournissent aux développeurs les outils dont ils ont besoin pour créer rapidement et facilement des applications web complexes et modernes.

### Variable d'environnement Storybook

Créer et ajouter un fichier `.env` dans le répertoire racine de votre projet et ajouter ce qui suit au fichier.

```
STORYBOOK_COVALENT_API_KEY = "<VOTRE_CLE_API>"
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

## 🤝 Contribution

Les contributions, les problèmes et les demandes de fonctionnalités sont les bienvenus !

N'hésitez pas à consulter la page <a href="https://github.com/covalenthq/goldrush-kit/issues">questions</a>.

## Afficher votre soutien

Donner un ⭐️ si ce projet vous a aidé !

## 📝 License

Ce projet est sous licence <a href="https://github.com/covalenthq/goldrush-kit/blob/main/LICENSE">Apache 2.0</a>.
