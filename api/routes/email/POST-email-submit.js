import { RouteContext } from "gadget-server";
import * as EmailValidator from 'email-validator';
 
/**
 * Route handler for POST email/email-submit
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {

  const createPopupEmail = async (em, shopId) => {

    const record = await api.popupEmails.create({
      email: em,
        shop: {
          _link: shopId,
        },
    });

    return record
  }

  // Get customer ja edittaa jos email on jo customersseissa. 

  const data = request.body
  const email = data.email

  const validationResult = EmailValidator.validate(email);

  if (validationResult) {
    
    const shopifyClient = await connections.shopify.forShopId(data.shopId);

    const getCustomerResponse = await shopifyClient.graphql(
      `query GetCustomer {
        customers(first: 1, query: "${email}"){
          edges{
            node {
              id
              email
              emailMarketingConsent {
                consentUpdatedAt
                marketingOptInLevel
                marketingState
              }
            }
          }
        }
      }
    `);

    const customer = getCustomerResponse?.customers?.edges[0]?.node
    const customerExists = getCustomerResponse.customers.edges.length > 0
    
    if (!(customerExists)) {
      
      const secondResponse = await shopifyClient.graphql(
      `mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          userErrors {
            field
            message
          }
          customer {
            id
            email
            emailMarketingConsent {
              marketingOptInLevel
              marketingState
            }
          }
        }
    }`,
      {
        input: {
          email: data.email,
          emailMarketingConsent: {
            marketingOptInLevel: "SINGLE_OPT_IN",
            marketingState: "SUBSCRIBED"
          },
        }
      });

      if (secondResponse?.customerCreate?.customer != 'null') {

        logger.info(secondResponse, "Email submission successful.")
        await reply.code(200).send({ message: 'Success: email subscription successful' });

        const popupEmailCreation = await createPopupEmail(data.email, data.shopId)
        logger.info(popupEmailCreation, "Email creation logged.")

      }
      
      else {
        logger.info(data.email, "Email submission failed.")
        await reply.code(401).send('Email submission failed.');

    }

    
    } else if (customerExists && customer?.emailMarketingConsent?.marketingState !== 'SUBSCRIBED') {

      const oldCustomerOptInResponse = await shopifyClient.graphql(`
      mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
        customerEmailMarketingConsentUpdate(input: $input) {
          userErrors {
            field
            message
          }
        }
      }`, {
        input: {
          customerId: `${customer.id}`,
          emailMarketingConsent: {
            marketingOptInLevel: "SINGLE_OPT_IN",
            marketingState: "SUBSCRIBED"
          }
        }
      });

      logger.info(oldCustomerOptInResponse, "Old customer subscribed.")
      await reply.code(200).send({ message: 'Success: email subscription successful' });

      const popupEmailCreation = await createPopupEmail(data.email, data.shopId)
      logger.info(popupEmailCreation, "Email creation logged.")

    } else {

        logger.info(getCustomerResponse, "Customer has already subscribed.")
      await reply.code(200).send({ message: 'Failure: customer has already subscribed.' });
        
    }
    
  } else {
    logger.info(data.email, "Email validation failed.")
    await reply.code(401).send('Email submission failed.');

  }
  
}
