import React from 'react'
import {GoldRushProvider} from '@covalenthq/goldrush-kit';
import '@covalenthq/goldrush-kit/styles.css';

function App() {
  return (
    <div>
      <GoldRushProvider apikey={"cqt_rQf6TP9W6WKQGWJvm7rcVKKRCj9v"}>
        {/* <BlockDetailsDisplay chain_name={'eth-mainnet'}
    block_id={'12345678'}
    icon_url={"https://goldrush.vercel.app/icons/token.svg"}/> */}
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
      </GoldRushProvider>
    </div>
  )
}

export default App