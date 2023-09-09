import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { pulsechainV4, pulsechain} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [pulsechainV4, pulsechain],
  [publicProvider()],
  {
    batch: {
      multicall: {
        batchSize: 4096,
        wait: 500,
      },
    },
  }
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { wagmiConfig, chains };
