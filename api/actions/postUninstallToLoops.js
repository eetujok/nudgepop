import { PostUninstallToLoopsGlobalActionContext } from "gadget-server";

/**
 * @param { PostToLoopsGlobalActionContext } context
 */

export const params = {
  shopId: {
    type: "string"
  }

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
      userId: shopId
    })
  };

  try {
    const response = await fetch('https://app.loops.so/api/v1/contacts/delete', options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonResponse = await response.json();
    logger.info(jsonResponse);
  } catch (err) {
    logger.error(err);
  }
};
