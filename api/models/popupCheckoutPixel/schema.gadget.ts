import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "popupCheckoutPixel" model, go to https://seetext-exit-intent.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "ZZxSrzKh_2At",
  fields: {
    clientId: { type: "string", storageKey: "B4US5BgmfkHM" },
    name: { type: "string", storageKey: "rhuOMeV87oYP" },
    popupActivationPixel: {
      type: "hasOne",
      child: {
        model: "popupActivationPixel",
        belongsToField: "popupCheckoutPixel",
      },
      storageKey: "ApYd4aSXPXnH",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "6Q5kyNjMkZ7M",
    },
    totalPrice: { type: "number", storageKey: "oHvRC4slIzYk" },
  },
};
