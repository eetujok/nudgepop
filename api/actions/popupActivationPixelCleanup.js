import { PotentialRevenueCalcGlobalActionContext } from "gadget-server";

/**
 * @param { PotentialRevenueCalcGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {

  
  const allRecords = [];
  const oneDayAgo = new Date(Date.now() - 86400000);
  
  let records = await api.popupActivationPixel.findMany({
      first: 250,
      select: {
        id: true,
      },
      filter: {
        AND: [
          { createdAt: { after: oneDayAgo } }, { popupCheckoutPixel: { isSet: false } } 

        ]
      },
    });

    allRecords.push(...records);

    while (records.hasNextPage) {
      records = await records.nextPage();
      allRecords.push(...records);
    }
  
  const idArray = records.map(a => a.id)

  await api.popupActivationPixel.bulkDelete(idArray)

};

export const options = {
  triggers: {
    scheduler: [
      { every: "day", at: "00:00 UTC" },
    ],
  },
}