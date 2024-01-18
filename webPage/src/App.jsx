import React from 'react'
import {GoldRushProvider} from '@covalenthq/goldrush-kit';
import '@covalenthq/goldrush-kit/styles.css';

function App() {
  return (
    <div>
      <GoldRushProvider apikey={"cqt_rQf6TP9W6WKQGWJvm7rcVKKRCj9v"}>
        <BlockDetailsDisplay chain_name={'eth-mainnet'}
    block_id={'12345678'}
    icon_url={"https://goldrush.vercel.app/icons/token.svg"}/>
      </GoldRushProvider>
    </div>
  )
}

export default App