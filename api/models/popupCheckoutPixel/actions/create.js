import { applyParams, save, ActionOptions, CreatePopupPixelActionContext } from "gadget-server";

/**
 * @param { CreatePopupPixelActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { CreatePopupPixelActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {

  const oneHourAgo = new Date(Date.now() - 3600000);

  if (record && record.name && record.name == 'checkout_completed') {

    const data = await api.popupActivationPixel.maybeFindFirst({
      filter: {
        AND: [
          { clientId: { equals: record.clientId } }, 
          { createdAt: { 
              after: oneHourAgo 
            } 
          },
          { popupCheckoutPixel: { isSet: false } },
        ]
      },
      select: {
        id: true,
      }
    })

    if (data && data.id) {

      const activationUpdateRecord = await api.popupActivationPixel.update(data.id, {
        popupCheckoutPixel: {
          _link: record.id
        }
      })

      logger.info({ activationUpdateRecord }, "Popup revenue attributed")

    }

  }
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
