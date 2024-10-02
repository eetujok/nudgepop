import { applyParams, save, ActionOptions, InstallShopifyShopActionContext } from "gadget-server";
import { identifyShop } from '../../../services/mantle'

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { InstallShopifyShopActionContext } context
 */

export async function onSuccess({ params, record, logger, api, connections }) {
  
  const uuid = crypto.randomUUID();

  const response = await connections.shopify.current.graphql(
    `
      mutation webPixelCreate($webPixel: WebPixelInput!) {
        webPixelCreate(webPixel: $webPixel){
          userErrors {
            code
            field
            message
          }
          webPixel {
            settings
            id
          }
        }
      }
    `,{
      webPixel: {
        settings: {
          accountID: uuid,
        },
      },
      }
  )
  logger.info({ response }, "attempting to activate the pixel")

  if (response.webPixelCreate.userErrors.length === 0) {
    await api.internal.shopifyShop.update(record.id, {
      pixelAccountId: uuid,
    })
  await api.shopifySync.run({
    domain: record.domain,
    shop: {
      _link: record.id
    }
  })
  await identifyShop({
    shop: record,
    api,
  });
  } else {
    logger.error({ response }, "failed to activate the pixel")
  }


  await api.postToLoops({
    shopId: record.id,
    shopOwner: record.shopOwner,
    shopEmail: record.email
  });


};

/** @type { ActionOptions } */
export const options = { actionType: "create" };
