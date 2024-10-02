import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "popupEmails" model, go to https://seetext-exit-intent.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "m4mxFDY293ZP",
  fields: {
    email: { type: "string", storageKey: "feue0Y6hAVah" },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "CP8AMri2d8C2",
    },
  },
};
