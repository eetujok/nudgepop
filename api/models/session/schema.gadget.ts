import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://seetext-exit-intent.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "senVjqUMX-6c",
  fields: {
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "jqLmQMj_9Ogh",
    },
  },
  shopify: { fields: ["shop", "shopifySID"] },
};
