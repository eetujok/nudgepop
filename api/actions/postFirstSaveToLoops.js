import { PostFirstSaveToLoopsGlobalActionContext } from "gadget-server";

/**
 * @param { PostFirstSaveToLoopsGlobalActionContext } context
 */

export const params = {
  shopId: {
    type: "string"
  },
  totalValue: {
    type: "number"
  }
}

export async function run({ params, logger, api, connections }) {

  const { shopId, totalValue } = params;

  const options = {
    method: 'POST',
    headers: {
      Authorization: process.env.LOOPS_AUTH_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      eventName: 'firstSave',
      eventProperties: {
        valueSaved: totalValue
      },
      userId: shopId
    })
  };

  try {
    const response = await fetch('https://app.loops.so/api/v1/events/send', options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonResponse = await response.json();
    logger.info(jsonResponse);
  } catch (err) {
    logger.error(err);
  }
};
