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

<h1 align="center">आपके डीएप फ्रंटएंड के लिए खूबसूरती से डिज़ाइन किए गए रिएक्ट कॉम्पोनेन्ट.</h1>

<div align="center">
200+ चेन्स . ओपन-सोर्स  . अनुकूलन.
</div>
  <p align="center">
    <br />
    <a href="https://www.covalenthq.com/docs/unified-api/goldrush/kit/gold-rush-provider/" rel="dofollow"><strong>दस्तावेज़ों का अन्वेषण करें »</strong></a>
    <br />
</p>

## स्थापित करें

इनस्टॉल `goldrush-kit` का उपयोग करते हुए `npm`:

```bash
npm install @covalenthq/goldrush-kit
```

या `yarn`:

```bash
yarn add @covalenthq/goldrush-kit
```

## कार्यान्वयन

1. इम्पोर्ट `GoldRushProvider`

```tsx
import { GoldRushProvider } from "@covalenthq/goldrush-kit";
```

2. एप्लिकेशन के चारों ओर `GoldRushProvider` लपेटें.
3. प्रोवाइडर को कॉन्फ़िगर करें और इसे अपनी सहसंयोजक एपीआई की के साथ `एपिकी` प्रॉप्स में जोड़ें. आप [कवलेंट वेबसाइट](https://www.covalenthq.com) पर निःशुल्क कुंजी के लिए पंजीकरण कर सकते हैं.

```tsx
<GoldRushProvider apikey="<YOUR_API_KEY>">{children}</GoldRushProvider>
```

4. अपने एप्लिकेशन में स्टाइलशीट जोड़ें.

```tsx
import "@covalenthq/goldrush-kit/styles.css";
```
5.वांछित कंपोनेंट्स जोड़ें. यदि आप `next.js` संस्करण `^13.0` का उपयोग कर रहे हैं और `app` राउटर का उपयोग कर रहे हैं, तो सुनिश्चित करें कि आपके पास `नेक्स्ट के सर्वर कंपोनेंट्स` मॉड्यूल को अक्षम करने के लिए फ़ाइल के शीर्ष पर `use client;` है। अधिक जानकारी के लिए [गोल्डरश के कंपोनेंट्स](https://www.covalenthq.com/docs/unified-api/goldrush/kit/gold-rush-provider/) दस्तावेज़ पर जाएँ।


```tsx
import {
    GoldRushProvider,
    NFTWalletTokenListView,
    TokenBalancesListView,
    TokenTransfersListView,
    AddressActivityListView,
} from "@covalenthq/goldrush-kit";
```

## रेडी-टू-गो रिएक्ट कंपोनेंट उदाहरण

आरंभ करने के लिए यहां एक पूर्ण उदाहरण दिया गया है। यदि आप `next.js` संस्करण `^13.0` का उपयोग कर रहे हैं और `app` राउटर का उपयोग कर रहे हैं, तो सुनिश्चित करें कि आपके पास नेक्स्ट के सर्वर कंपोनेंट्स मॉड्यूल को अक्षम करने के लिए फ़ाइल के शीर्ष पर `use client;` है

**ध्यान दें:** आपको अपनी एपीआई की को हमेशा निजी रखना चाहिए, इसे कभी भी सीधे अपने कोड में न डालें, विशेषकर फ्रंट एंड कोड में। इसके बजाय, कुंजी को अपने कोड में इंजेक्ट करने के लिए एक पर्यावरण चर का उपयोग करें।

```tsx
// 'use client'; 
// If using Next.js, put your API key in a .env.local file
<GoldRushProvider apikey={process.env.NEXT_PUBLIC_API_KEY} mode="dark" color="emerald">
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
        chain_name="eth-mainnet"
    />
</GoldRushProvider>
```

## GoldRush Templates

|टेम्पलेट|विवरण|लिंक |
|---|---|---|
|Wallet & Portfolio UI|अपने टोकन और एनएफटी को कई श्रृंखलाओं में प्रदर्शित करें.|https://github.com/covalenthq/goldrush-wallet-portfolio-ui|
|NFT Collection Gallery & Analytics UI|जल्द आ रहा है!||
|Uniswap-like Analytics UI|जल्द आ रहा है!||


## स्टोरीबुक के साथ बनाएं और अनुकूलित करें

ऊपर उपयोग किए गए कंपोनेंट्स रिएक्ट, टेलविंड और टाइपस्क्रिप्ट निर्मित हैं। आप स्टोरीबुक का उपयोग करके कंपोनेंट्स का प्रीव्यू और कस्टमाइज़ कर सकते हैं

स्टोरीबुक डेवलपर्स को त्वरित रूप से प्रोटोटाइप बनाने और अलग-अलग कंपोनेंट्स को विकसित करने का एक तरीका प्रदान करता है, जबकि रिएक्ट एक वेब एप्लिकेशन को जल्दी से बनाने के लिए उपकरण प्रदान करता है। टेलविंड पूर्व-निर्मित यूआई कंपोनेंट्स और उपयोगिता वर्गों की एक लाइब्रेरी प्रदान करता है, जबकि टाइपस्क्रिप्ट विकास प्रक्रिया में प्रकार की सुरक्षा और स्वत: पूर्णता जोड़ता है। साथ में, ये उपकरण डेवलपर्स को वे उपकरण प्रदान करते हैं जिनकी उन्हें जटिल, आधुनिक वेब एप्लिकेशन जल्दी और आसानी से बनाने के लिए आवश्यकता होती है.

### Storybook Environmental Variable

अपने प्रोजेक्ट की रूट डायरेक्टरी में एक `.env` फ़ाइल बनाएं और जोड़ें और फ़ाइल में निम्नलिखित जोड़ें।

```
STORYBOOK_COVALENT_API_KEY = "<आपकी_एपीआई_कुंजी>"
```

### शुरू कैसे करें

```bash
npm run dev
```

### कंपोनेंट लाइब्रेरी बनाएं/बंडल करें

```bash
npm run build:library
```

### डिप्लॉयमेंट के लिए स्टोरीबुक बनाएं/बंडल करें

```bash
npm run build:storybook
```

## 🤝 योगदान

योगदान, मुद्दे और सुविधा अनुरोधों का स्वागत है!
बेझिझक जांच करें <a href="https://github.com/covalenthq/goldrush-kit/issues">issues</a> पेज.

## अपना समर्थन दिखाएँ

यदि इस परियोजना से आपको मदद मिली तो ⭐️ दें!



## 📝 License

यह प्रोजेक्ट <a href="https://github.com/covalenthq/goldrush-kit/blob/main/LICENSE">Apache 2.0</a> लाइसेंस प्राप्त है।

