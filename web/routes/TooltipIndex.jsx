import { useFindFirst } from "@gadgetinc/react";
import {
  Banner,
  BlockStack,
  Layout,
  Page,
  Button,
  Card,
  Text,
  InlineGrid,
  InlineStack,
  Spinner,
  Bleed,
  Thumbnail
} from "@shopify/polaris";
import writeContent from '../assets/writeContent.png'
import Conditions from '../assets/Conditions.png'
import Customize from '../assets/Customize.png'
import { api } from "../api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from '@shopify/polaris-icons';
import Dashboard from "../components/Dashboard";

export default () => {

  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const navigate = useNavigate();

  const [{ data: content, fetching: fetchingContent, error: errorFetchingContent }] =  useFindFirst(api.shopifyShop, {
    select: {
      id: true,
      inSetup: true,
      showReviewPopup: true,
    }
  });

  useEffect(() => {

    const loadCrispScript = () => {
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = "32d902ee-ad1b-4a8f-a0eb-2a9874403fae";
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    };

    loadCrispScript();

    return () => {
      const crispScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]');
      if (crispScript) {
        crispScript.remove();
      }
  
      delete window.$crisp;
      delete window.CRISP_WEBSITE_ID;
    };
  }, []);


  if (fetchingContent) {
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

  const handleSetupStart = () => {
    navigate('/tooltip-content');
  };




  if (content.inSetup) {
    return (
      <Page>
        <BlockStack gap="500">
          {show && (
            <Banner
              title={bannerContext}
              tone="critical"
              onDismiss={() => setShow(false)}
            />
          )}
          <Layout>
            <Layout.Section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2em', marginBottom: '2em'}}>
                <Text as="h1" variant="headingLg">🎉 Thank you for installing NudgePop: Floating Exit Popup! 🎉</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2em', marginBottom: '2em'}}>
                <Text as="h2" variant="bodyLg">Follow the setup instructions to add your cursor popup in less than 10 minutes.</Text>
              </div>
              <Card roundedAbove="sm">
                <BlockStack gap="200" align="center">
                  <InlineGrid gap="400" columns={3}>
                    <Bleed marginBlock="400" marginInline="400">
                    <div style={{backgroundColor: '#F6F6F6', borderRadius: '0.6em', height: "fit-content", borderRightWidth: '1px', borderColor: 'rgba(227, 227, 227, 1)'}}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1em', marginBottom: '1em', backgroundColor: '#FFFFFF'}}>
                      <img src={writeContent} style={{width: '200px', height: '200px'}}></img>
                    </div>
                    <div style={{padding: '20px', height: '150px'}}>
                        <BlockStack gap="500">
                          <Text as="h2" variant="headingMd">
                            Step 1 - Customize content
                          </Text>
                          <Text as="p" variant="bodyMd">Customize the popups content, or use our already configured template. Your themes font will be inherited on install.</Text>
                        </BlockStack>
                      </div>
                      </div>
                    </Bleed>
                    <Bleed marginBlock="400" marginInline="400">
                    <div style={{backgroundColor: '#F6F6F6', borderRadius: '0.6em', height: "fit-content", borderRightWidth: '1px', borderColor: 'rgba(227, 227, 227, 1)'}}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1em', marginBottom: '1em', backgroundColor: '#FFFFFF'}}>
                      <img src={Customize} style={{width: '200px', height: '200px'}}></img>
                    </div>
                    <div style={{padding: '20px', height: '150px'}}>
                        <BlockStack gap="500">
                          <Text as="h2" variant="headingMd">
                            Step 2 - Customize Style
                          </Text>
                          <Text as="p" variant="bodyMd">Customize the popups styling to fit your brand and site.</Text>
                        </BlockStack>
                      </div>
                      </div>
                    </Bleed>
                    <Bleed marginBlock="400" marginInline="400">
                    <div style={{backgroundColor: '#F6F6F6', borderRadius: '0.6em', height: "fit-content", borderRightWidth: '1px', borderColor: 'rgba(227, 227, 227, 1)'}}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1em', marginBottom: '1em', backgroundColor: '#FFFFFF'}}>
                      <img src={Conditions} style={{width: '200px', height: '200px'}}></img>
                    </div>
                    <div style={{padding: '20px', height: '150px'}}>
                        <BlockStack gap="500">
                          <Text as="h2" variant="headingMd">
                            Step 3 - Conditions
                          </Text>
                          <Text as="p" variant="bodyMd">Configure when your popup will show. After this step, activate your trial and add the popup to your storefront!</Text>
                        </BlockStack>
                      </div>
                      </div>
                    </Bleed>
                  </InlineGrid>
                </BlockStack>
              </Card>
              <InlineStack align="center">
              <div style={{ marginTop: '2em', marginBottom: '2em', width: '40%' }}>
                  <Button icon={ArrowRightIcon}  size="large" variant="primary" fullWidth onClick={handleSetupStart}>
                  Start setup
                </Button>
              </div>
              </InlineStack>
            </Layout.Section>
          </Layout>
        </BlockStack>
      </Page>
    );
  } else {
    return (
      <Dashboard shopId={content.id} />
    )
  }
  
};
