import type { PrivateKeyAccount } from "viem";
import { createWalletClient, http, publicActions } from "viem";
import {
  arbitrum,
  base,
  baseSepolia,
  zeroGMainnet,
  zeroGTestnet,
} from "viem/chains";

export const SUPPORTED_EVM_CHAINS = {
  "eip155:16661": zeroGMainnet,
  "eip155:16602": zeroGTestnet,
  "eip155:8453": base,
  "eip155:84532": baseSepolia,
  "eip155:42161": arbitrum,
} as const;

export type EvmChainId = keyof typeof SUPPORTED_EVM_CHAINS;

export const createEvmWalletClient = (
  chainId: EvmChainId,
  rpcUrl: string,
  account: PrivateKeyAccount
) => {
  const chain = SUPPORTED_EVM_CHAINS[chainId];

  return createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  }).extend(publicActions);
};

export type EvmWalletClient = ReturnType<typeof createEvmWalletClient>;
