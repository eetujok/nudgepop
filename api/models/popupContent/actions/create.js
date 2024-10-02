import { applyParams, save, ActionOptions, CreatePopupContentActionContext } from "gadget-server";

/**
 * @param { CreatePopupContentActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { CreatePopupContentActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {

  
  const shop = api.shopifyShop.findFirst({
    filter: {
      id: {equals: record.shopId}
    },
    select: {
      id: true,
      popupIdentifier: true
    }
  })

  const newId = Date.now().toString()

  if (shop && typeof shop.popupIdentifier !== 'string') {

    const appInstallation = await connections.shopify.current?.graphql(`
      query {
        currentAppInstallation {
          id
        }
      }`
    )

    logger.info(appInstallation, "currentAppInstallation parsed from shopify")

    const response = await connections.shopify.current?.graphql(`
        mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafieldsSetInput) {
          metafields {
            id
            namespace
            key
          }
          userErrors {
            field
            message
          }
        }
      }`
      , {
          "metafieldsSetInput": [
            {
              "namespace": "seetext-popup",
              "key": "popupParameters",
              "type": "single_line_text_field",
              "value": `${newId}`,
              "ownerId": `${appInstallation.currentAppInstallation.id}`
            }
          ]
        }
    )

    logger.info(response, "App installation metafield creation.");

    void await api.internal.shopifyShop.update(record.shopId, {
      popupIdentifier: newId
    })

    const secondResponse = await connections.shopify.current?.graphql(`
      query {
        appInstallation {
        metafields(first: 5, namespace: "seetext-popup") {
          nodes {
          id
          key
          value
          }
        }
        }
        }`)

    logger.info(secondResponse, "Metafields value after second query.")

  }
  
  
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
