import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "popupContent" model, go to https://seetext-exit-intent.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DbKPNRi75uXl",
  fields: {
    body: { type: "string", storageKey: "hWB480_3xn-P" },
    bodyFontSize: { type: "number", storageKey: "0oSE3FLV91ZK" },
    bodyWeight: { type: "number", storageKey: "9xmj33p0pSRl" },
    centering: { type: "string", storageKey: "oQfngx7ZTQkA" },
    couponCode: { type: "string", storageKey: "ioLjt2yZBt6p" },
    emailForm: {
      type: "boolean",
      default: false,
      storageKey: "2yeStrjNYfaX",
    },
    heading: { type: "string", storageKey: "lFlpKFNqhKlz" },
    headingFontSize: { type: "number", storageKey: "cfPcVE-mM4N3" },
    headingWeight: { type: "number", storageKey: "bB8e9_iHjCt7" },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "lT0PYqrU0wC4",
    },
    status: {
      type: "boolean",
      default: false,
      storageKey: "LD5TTCFks48G",
    },
    toCartButton: {
      type: "boolean",
      default: false,
      storageKey: "Btgao7uBnrOJ",
    },
  },
};
