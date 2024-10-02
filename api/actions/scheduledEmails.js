import { ScheduledEmailsGlobalActionContext } from "gadget-server";

/**
 * @param { ScheduledEmailsGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {

  const allRecords = [];


  let records = await api.shopifyShop.findMany({
      first: 250,
      select: {
        id: true,
        firstEmail: true,
        firstSave: true,
        popupCheckoutPixels: {
          edges: {
            node: {
              id: true,
              popupActivationPixel: {
                id: true,
              },
              totalPrice: true
            }
          }

        },
        popupEmails: {
          edges: {
            node: {
              id: true,
            }
          }
        },
      },
      filter: {
        OR: [
          {
            firstEmail: { equals: false }
          },
          {
            firstSave: { equals: false }
          },
        ],
      },
  });

  allRecords.push(...records);

  while (records.hasNextPage) {
    records = await records.nextPage();
    allRecords.push(...records);
  }

  logger.info(allRecords, "Scheduled emails all shops response,")

  const updateFirstEmailArray = []
  const updateFirstSaveArray = []


  for (const record of allRecords) {
    if (record.firstEmail == false && record.popupEmails && record.popupEmails.edges.length > 0) {
      await api.postFirstEmailToLoops({ shopId: record.id });
      updateFirstEmailArray.push(record.id)
    }

    if (record.firstSave == false && record.popupCheckoutPixels && record.popupCheckoutPixels.edges.length > 0) {

      for (const edge of record.popupCheckoutPixels.edges) {

        if (edge?.node.popupActivationPixel != null) {

          await api.postFirstSaveToLoops({ shopId: record.id, totalValue: edge.node.totalPrice });
          updateFirstSaveArray.push(record.id)
          break

        }

      }
    }
  }
  
  if (updateFirstEmailArray.length > 0) {

    for (const recordId of updateFirstEmailArray) {
        await api.internal.shopifyShop.update(recordId, {
          firstEmail: true
        })
    }
      
  };

  if (updateFirstSaveArray.length > 0) {

      for (const recordId of updateFirstSaveArray) {
        await api.internal.shopifyShop.update(recordId, {
          firstSave: true
        })
    }

  }

  logger.info("Email sync complete.")

};

export const options = {
  triggers: {
    scheduler: [
      { every: "day", at: "00:00 UTC" },
      { every: "day", at: "12:00 UTC" },
    ],
  },
}