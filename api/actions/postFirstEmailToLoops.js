import { PostFirstEmailToLoopsGlobalActionContext } from "gadget-server";

/**
 * @param { PostFirstEmailToLoopsGlobalActionContext } context
 */

export const params = {
  shopId: {
    type: "string"
  },
}

export async function run({ params, logger, api, connections }) {

  const { shopId } = params;

  const options = {
    method: 'POST',
    headers: {
      Authorization: process.env.LOOPS_AUTH_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      eventName: 'firstEmail',
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
