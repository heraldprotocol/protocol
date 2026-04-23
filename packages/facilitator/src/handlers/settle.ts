import type { PaymentPayload, PaymentRequirements } from "@x402/core/types";
import {
  parsePaymentPayload,
  parsePaymentRequirements,
} from "@x402/core/schemas";
import { ExactEvmScheme } from "@x402/evm";
import { Hono } from "hono";
import { validator } from "hono/validator";

import type { Env } from "../env";
import { internalServerError } from "../errors";
import {
  isRouteError,
  parseRouter,
  resolveRoute,
  STABLECOIN_REGISTRY,
} from "../lib/x402/router";

const settleHandler = new Hono<Env>();

settleHandler.post(
  "/",
  validator("json", (value, c) => {
    const { paymentPayload, paymentRequirements } = value;

    const resolvedPaymentPayload = parsePaymentPayload(paymentPayload);
    if (!resolvedPaymentPayload.success)
      return c.json(resolvedPaymentPayload.error, 400);

    const resolvedPaymentRequirements =
      parsePaymentRequirements(paymentRequirements);
    if (!resolvedPaymentRequirements.success)
      return c.json(resolvedPaymentRequirements.error, 400);

    return {
      paymentPayload: resolvedPaymentPayload.data,
      paymentRequirements: resolvedPaymentRequirements.data,
    };
  }),
  async (c) => {
    try {
      const { paymentPayload, paymentRequirements } = c.req.valid("json");

      const route = parseRouter(paymentRequirements as PaymentRequirements);

      if (!route) {
        const settleResponse = await c.var.X402_FACILITATOR.settle(
          paymentPayload as PaymentPayload,
          paymentRequirements as PaymentRequirements
        );
        return c.json(settleResponse, 200);
      }

      const resolved = resolveRoute(paymentRequirements as PaymentRequirements);

      if (isRouteError(resolved)) {
        return c.json(
          {
            success: false,
            errorReason: resolved.error,
            errorMessage: "reason" in resolved ? resolved.reason : undefined,
            transaction: "",
            network: (paymentRequirements as PaymentRequirements).network,
          },
          200
        );
      }

      const routerAddress = c.var.X402_ROUTER_ADDRESS;

      const srcRequirements: PaymentRequirements = {
        ...(paymentRequirements as PaymentRequirements),
        network: resolved.src,
        asset: STABLECOIN_REGISTRY[resolved.src].address,
        payTo: routerAddress,
      };

      // Step A: settle client-signed payload on source chain (client → router)
      const srcSettle = await c.var.X402_FACILITATOR.settle(
        paymentPayload as PaymentPayload,
        srcRequirements
      );

      if (!srcSettle.success) {
        return c.json(
          {
            ...srcSettle,
            network: resolved.dst,
            extra: {
              spaceobject: {
                route: {
                  from: resolved.src,
                  transaction: srcSettle.transaction,
                },
              },
            },
          },
          200
        );
      }

      const dstClient = c.var.X402_WALLET_CLIENTS[resolved.dst];

      if (!dstClient) {
        console.error({
          error: "RouteSettleFailure",
          message: `no client for destination ${resolved.dst} after source settled`,
          sourceTx: srcSettle.transaction,
        });
        return c.json(
          {
            success: false,
            errorReason: "unsupported_route",
            errorMessage: `no client configured for destination ${resolved.dst}`,
            transaction: "",
            network: resolved.dst,
            extra: {
              spaceobject: {
                route: {
                  from: resolved.src,
                  transaction: srcSettle.transaction,
                },
              },
            },
          },
          200
        );
      }

      // Step B: router signs and settles its own payment on destination chain (router → server)
      const dstRequirements = paymentRequirements as PaymentRequirements;

      const routerScheme = new ExactEvmScheme(dstClient.account);
      const payloadResult = await routerScheme.createPaymentPayload(
        2,
        dstRequirements
      );

      const routerPayload: PaymentPayload = {
        x402Version: 2,
        accepted: dstRequirements,
        payload: payloadResult.payload,
      };

      try {
        const dstSettle = await c.var.X402_FACILITATOR.settle(
          routerPayload,
          dstRequirements
        );

        return c.json(
          {
            ...dstSettle,
            extra: {
              spaceobject: {
                route: {
                  from: resolved.src,
                  transaction: srcSettle.transaction,
                },
              },
            },
          },
          200
        );
      } catch (dstErr) {
        console.error({
          error: "RouteSettleDestinationFailure",
          message: "step-B settle failed after source settled",
          sourceTx: srcSettle.transaction,
          destinationChain: resolved.dst,
          cause: dstErr instanceof Error ? dstErr.message : String(dstErr),
        });

        return c.json(
          {
            success: false,
            errorReason: "destination_settle_failed",
            errorMessage:
              "source settled but destination settle failed; manual refund required",
            transaction: "",
            network: resolved.dst,
            payer: srcSettle.payer,
            extra: {
              spaceobject: {
                route: {
                  from: resolved.src,
                  transaction: srcSettle.transaction,
                },
              },
            },
          },
          200
        );
      }
    } catch (err) {
      console.error({
        error: err instanceof Error ? err.name : "UnknownError",
      });

      return c.json(internalServerError, 500);
    }
  }
);

export { settleHandler };
