import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "popupActivationPixel" model, go to https://seetext-exit-intent.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "wZucOLGRpzzj",
  fields: {
    clientId: { type: "string", storageKey: "FrB5ZnouwZ3A" },
    name: { type: "string", storageKey: "PRHKO6xRR3cg" },
    popupCheckoutPixel: {
      type: "belongsTo",
      parent: { model: "popupCheckoutPixel" },
      storageKey: "c7UtLomkvh0P",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "fUb1hKuudOPF",
    },
  },
};
