import {
  Layout,
  Page,
  Button,
  BlockStack,
  Text,
  Card,
  Divider,
  Spinner
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { useFindFirst } from "@gadgetinc/react";
import { ArrowRightIcon } from '@shopify/polaris-icons';
import { api } from '../api';
import Step1 from '../assets/Step1.png'
import Step2 from '../assets/Step2.png'



export default () => {

  const navigate = useNavigate();
  
  const handleDeepLink = () => {
    const openUrl = `https://${shop.domain}/admin/themes/current/editor?template=product`;
    window.open(openUrl, "_blank");
  }

  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =  useFindFirst(api.shopifyShop, {
    select: {
      domain: true,
    }
  });

  if (fetchingShop) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner accessibilityLabel="Spinner example" size="large" />
      </div>
    );
  }
  

    return (
      <Page title="Install instructions"
            backAction={{ content: "Shop Information", onAction: () => navigate("/"),}}
            subtitle="To install the popup, follow these steps.">
        <Layout>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Layout.Section>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '600px', marginBottom: '2em'}}>
            <Card>
              <BlockStack gap="800">
                <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Step 1</Text>
                <Text as="" variant="bodyMd">Click the button <strong>'Install Button'</strong> below this guide, navigate to the App embed - tab on the left hand side of your theme editor and activate: Floating Exit Popup in your theme editor.</Text>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <img src={Step1} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '300px'}}></img>
                </div>

                </BlockStack >
                <Divider />
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Step 2</Text>
                  <Text as="" variant="bodyMd">After activating, click save in the upper right corner of the editor and your popup will be activated!</Text>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <img src={Step2} style={{maxWidth: '300px'}}></img>
                  </div>
                </BlockStack >
                <Button onClick={handleDeepLink} variant="primary" icon={ArrowRightIcon}>Install Popup</Button>
              </BlockStack>
              </Card>
            </div>
          </Layout.Section>
          </div>
        </Layout>
      </Page>
  );
    
    

}
