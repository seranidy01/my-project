import { CHAIN_ID } from "src/types/enums";

export interface Addresses {
  wethAddress: string;
  usdcAddress: string;
  usdtAddress: string;
}

const mainnetAddresses: Addresses = {
  wplsAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  bdaiAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  daiAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
};

const pulsechainv4Addresses: Addresses = {
  wplsAddress: "0x70499adEBB11Efd915E3b69E700c331778628707",
  bdaiAddress: "0x9F1226D338162Cfff753308CB464C83a7C9312e3",
  daiAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
};

export const CONTRACTS: { [key: number]: Addresses } = {
  [CHAIN_ID.PULSECHAIN]: mainnetAddresses,
  [CHAIN_ID.PULSECHAINV4]: pulsechainv4Addresses,
};
