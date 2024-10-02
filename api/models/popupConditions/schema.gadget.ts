import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "popupConditions" model, go to https://seetext-exit-intent.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "8sBGhEItVIeY",
  fields: {
    conditionScroll: { type: "string", storageKey: "zwZQD8OT6Nc-" },
    conditionTime: { type: "string", storageKey: "Wwz2pR-BsgyF" },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "MkXc02223Ime",
    },
    triggerAlways: {
      type: "boolean",
      default: false,
      storageKey: "otDDVHbfTrSj",
    },
    triggerCartAbandon: {
      type: "boolean",
      default: true,
      storageKey: "vO4vtWsu8wTU",
    },
  },
};
