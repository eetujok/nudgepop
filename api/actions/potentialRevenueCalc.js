import { PotentialRevenueCalcGlobalActionContext } from "gadget-server";
import { getWeek, getYear} from "date-fns";

/**
 * @param { PotentialRevenueCalcGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {

  const oneWeekAgo = new Date(Date.now() - 604800000);
  const currentWeek = getWeek(new Date)
  const currentYear = getYear(new Date)

  const allViewRecords = []; 
  
  const popupViews = await api.popupView.findMany({
    first: 250,
    select: {
      id: true,
      shopId: true,
    },
    filter: {
      createdAt: {
        after: oneWeekAgo,
      },
    },
  });
  
  allViewRecords.push(...records);

  while (popupViews.hasNextPage) {
    popupViews = await popupViews.nextPage();
    allViewRecords.push(...popupViews);
  }

  const allShopRecords = [];

  let shopRecords = await api.shopifyShop.findMany({
    first: 250,
    select: {
      id: true,
      averageOrderValue: true,
    },
  });

  allShopRecords.push(...shopRecords);

  while (shopRecords.hasNextPage) {
    shopRecords = await shopRecords.nextPage();
    allShopRecords.push(...shopRecords);
  }

  // Counting here:

  for (let i = 0; i < allShopRecords.length; i++) {

    const id = allShopRecords[i].id;
    const result = allViewRecords.filter(viewRecord => {
      viewRecord.shopId === id
    })
    const popupActivations = result.length

    const calc = allShopRecords[i].averageOrderValue * popupActivations // * yhdistettynä checkout_completed pixel eventtiin.

    const popupAnalyticsRecord = await api.popupAnalytics.create({
        shop: {
          _link: id,
        },
        valueInWeek: calc,
        activationsInWeek: popupActivations,
        weekNumber: currentWeek,
        year: currentYear,
    });
    
  }


};

export const options = {
  triggers: {
    scheduler: [
      {
        every: "week",
        on: "Monday",
        at: "00:00 UTC",
      },
    ],
  },
}