import { applyParams, save, ActionOptions, CreatePopupConditionsActionContext } from "gadget-server";

/**
 * @param { CreatePopupConditionsActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { CreatePopupConditionsActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {

    await api.internal.shopifyShop.update(record.shopId, {
      inSetup: false
    })
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
