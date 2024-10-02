import { RouteContext } from "gadget-server";

/**
 * Route handler for POST mantle/subscriptionActivated
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {


  const data = request.body;
  
  logger.info(data, "Data object")

  await api.internal.shopifyShop.update(data.customer.shopify.shopId, {
    isSubscribed: true,
  })
  
  return reply.code(204).send();

  
}
