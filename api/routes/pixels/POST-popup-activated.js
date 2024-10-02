import { RouteContext } from "gadget-server";

/**
 * Route handler for GET popupParams/[id]
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {

  const body = JSON.parse(request.body);
  const { data } = body

  let shop = await api.shopifyShop.maybeFindFirst({
    filter: {
      pixelAccountId: {
        equals: body.account
      }
    },
    select: {
      id: true
    }
  })

  logger.info({data, shop}, "incoming popup activation pixel event.")

  if (shop) {
    await api.popupActivationPixel.create({
      name: body.name,
      shop: {
        _link: shop.id
      },
      clientId: body.clientId
    })
  }
}