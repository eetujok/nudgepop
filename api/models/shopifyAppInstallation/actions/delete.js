import { preventCrossShopDataAccess, deleteRecord, ActionOptions, DeleteShopifyAppInstallationActionContext } from "gadget-server";

/**
 * @param { DeleteShopifyAppInstallationActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
};

/**
 * @param { DeleteShopifyAppInstallationActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = { actionType: "delete" };
