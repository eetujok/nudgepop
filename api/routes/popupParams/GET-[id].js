import { RouteContext } from "gadget-server";

/**
 * Route handler for GET popupParams/[id]
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {

    const shopId = request.params.id

    const fetchPopup = async ( shopId ) => {

        const data = await api.shopifyShop.findFirst({
            filter: {
              id: { equals: shopId },
            },
            select: {
              popupContent: {
                status: true,
                toCartButton: true,
                heading: true,
                body: true,
                bodyFontSize: true,
                headingFontSize: true,
                centering: true,
                bodyWeight: true,
                headingWeight: true,
                emailForm: true,
              },
              popupStyling: {
                backgroundColor: true,
                borderColor: true,
                textColor: true,
                borderRadius: true,
                borderWidth: true,
                bodyGap: true,
                maxWidth: true,
                padding: true,
                backgroundImage: {
                  url: true,
                },
              },
              popupConditions: {
                triggerAlways: true,
                triggerCartAbandon: true,
                conditionTime: true,
                conditionScroll: true,
              },
              isSubscribed: true,
            }
          });
          
      
          return data;
    }


  try {

    const popupData = await fetchPopup(shopId)
    await reply.code(200).send({ popupData });

  } catch (error) {
    logger.error(error, "Fetching popup failed:")
    await reply.code(401).send(`Fetching popup failed: ${error}`)
     
  }  
  

}
