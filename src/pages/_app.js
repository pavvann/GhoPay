import '@/styles/globals.css'

import { WagmiConfig, createConfig, sepolia } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    chains: [sepolia],
    alchemyId: process.env.ALCHEMY_ID, // or infuraId
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID,

    appName: "GhoPay",

    appDescription: "Payments, anyway you want.",

  }),
);


export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider theme="retro">
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  )
}
