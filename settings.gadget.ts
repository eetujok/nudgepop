import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.1.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2024-04",
        enabledModels: ["shopifyAppInstallation", "shopifyCustomer"],
        type: "partner",
        scopes: [
          "read_customer_events",
          "write_pixels",
          "write_customers",
          "read_customers",
        ],
      },
    },
  },
};
