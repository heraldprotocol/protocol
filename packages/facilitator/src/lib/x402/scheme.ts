import type { x402Facilitator } from "@x402/core/facilitator";
import type { FacilitatorEvmSigner } from "@x402/evm";
import { ExactEvmScheme } from "@x402/evm/exact/facilitator";
import { UptoEvmScheme } from "@x402/evm/upto/facilitator";

import type { EvmChainId } from "../chains/evm";

export const registerEvmExactScheme = (
  facilitator: x402Facilitator,
  chain: EvmChainId,
  signer: FacilitatorEvmSigner
) => {
  facilitator.register(
    chain,
    new ExactEvmScheme(signer, { deployERC4337WithEIP6492: true })
  );
};

export const registerEvmUptoScheme = (
  facilitator: x402Facilitator,
  chain: EvmChainId,
  signer: FacilitatorEvmSigner
) => {
  facilitator.register(chain, new UptoEvmScheme(signer));
};
