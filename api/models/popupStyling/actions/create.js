import { applyParams, save, ActionOptions, CreatePopupStylingActionContext } from "gadget-server";

/**
 * @param { CreatePopupStylingActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { CreatePopupStylingActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
