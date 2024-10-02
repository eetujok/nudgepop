import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "popupStyling" model, go to https://seetext-exit-intent.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "2eaAy4VBI4j9",
  fields: {
    backgroundColor: { type: "string", storageKey: "htuL7_1bBEfP" },
    backgroundColorHsba: { type: "json", storageKey: "R0V9CRcawA-7" },
    backgroundImage: {
      type: "file",
      allowPublicAccess: true,
      validations: {
        run: ["api/models/popupStyling/validations/validate.js"],
        imagesOnly: true,
      },
      storageKey: "7FLuEJ1_f_wX",
    },
    bodyGap: { type: "number", storageKey: "KAYPY5-9rkWa" },
    borderColor: { type: "string", storageKey: "_lmyI6Qk_h3H" },
    borderColorHsba: { type: "json", storageKey: "hj8dfLDxPPRs" },
    borderRadius: { type: "number", storageKey: "3x9k6Rkfjbvt" },
    borderWidth: { type: "number", storageKey: "r0Xo6D3GiHJt" },
    customCss: { type: "string", storageKey: "l1fyi2_pVYD-" },
    maxWidth: { type: "number", storageKey: "d0ahUiNKOV8i" },
    padding: { type: "number", storageKey: "wXMAjAbhuOrn" },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "yjKpKDtrkvBc",
    },
    textColor: { type: "string", storageKey: "Tjs0DLqHXC0H" },
    textColorHsba: { type: "json", storageKey: "A-sVz5QuED4E" },
  },
};
