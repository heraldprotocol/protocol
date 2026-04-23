import { Hono } from "hono";

import type { Env } from "../env";
import type { StablecoinChainId } from "../lib/x402/router";
import { internalServerError } from "../errors";
import { STABLECOIN_REGISTRY } from "../lib/x402/router";

const supportedHandler = new Hono<Env>();

supportedHandler.get("/", async (c) => {
  try {
    const base = c.var.X402_FACILITATOR.getSupported();

    const stablecoinChains = Object.keys(
      STABLECOIN_REGISTRY
    ) as StablecoinChainId[];

    const routedKinds = base.kinds.flatMap((kind) => {
      const dst = kind.network as StablecoinChainId;
      if (!(dst in STABLECOIN_REGISTRY)) return [];

      const fromNetworks = stablecoinChains.filter((c) => c !== dst);
      if (fromNetworks.length === 0) return [];

      return [
        {
          ...kind,
          extra: {
            ...kind.extra,
            spaceobject: { route: { fromNetworks } },
          },
        },
      ];
    });

    return c.json({ ...base, kinds: [...base.kinds, ...routedKinds] });
  } catch (err) {
    console.error({
      error: err instanceof Error ? err.name : "UnknownError",
    });

    return c.json(internalServerError, 500);
  }
});

export { supportedHandler };
