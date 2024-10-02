import {
  Banner,
  BlockStack,
  Layout,
  Page,
  Button,
  Card,
  Text,
  InlineStack,
  Bleed,
} from "@shopify/polaris";
import writeContent from '../assets/writeContent.png'
import Conditions from '../assets/Conditions.png'
import Customize from '../assets/Customize.png'
import { useMantle } from '@heymantle/react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PotentialRevenueLineChart from "./PotentialRevenueLineChart.jsx";

export default ({ shopId }) => {

  const { customer } = useMantle();

  var isSubscribed = false

  if (customer && customer.subscription) {
      isSubscribed = true
  }
  
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const navigate = useNavigate();

  const statisticPeriodOptions = [
    {label: 'Monthly', value: 'monthly'},
    {label: 'Weekly', value: 'weekly'},
  ];
  const handleEditContent = () => {
    navigate('/tooltip-content');
  };

  const handleEditStyle = () => {
    navigate('/tooltip-style');
  };

  const handleEditConditions = () => {
    navigate('/tooltip-conditions');
  };

  const handleInstall = () => {
    navigate('/tooltip-install')
  }

  const handleSubscription = () => {
    navigate('/plans')
  }

  
  return (
    <Page title="Welcome 👋">
      <BlockStack gap="500" >
        {show && (
          <Banner
            title={bannerContext}
            tone="critical"
            onDismiss={() => setShow(false)}
          />
        )}
        <Layout>
          <div style={{ marginBottom: '50px', minWidth: '80%' }}>
          <Layout.Section>
            <div style={{marginBottom: '25px'}}>
            <Banner title="Popup activation">
                  <p>If you haven't activated the popup in your theme editor, click activate popup. If you have disregard this message.</p>
              <div style={{marginTop: '0.5em'}}>
                    <Button onClick={handleInstall}>Activate popup</Button>
              </div>
                </Banner>
              </div>
              {!isSubscribed && (
                <div style={{ marginBottom: '25px' }}>
                  <Banner title="Action needed" tone="warning">
                    <p>You have to activate your trial or plan, for your popup to be activated on your page.</p>
                    <div style={{ marginTop: '0.5em' }}>
                      <Button onClick={handleSubscription}>To Plans</Button>
                    </div>
                  </Banner>
                </div>
              )}
              <BlockStack gap="400">
                <Card roundedAbove="sm">
                  <div style={{ padding: '25px' }}>
                    <BlockStack gap="400" align="space-around">
                      <div>
                        <PotentialRevenueLineChart shopId={shopId}/>
                      </div>
                    </BlockStack>
                  </div>
                </Card>
                <Card roundedAbove="sm">
                    <InlineStack align="space-between">
                        <div style={{padding: '25px'}}>
                            <BlockStack gap="400" align="space-around">
                                    <Text as="h2" variant="headingMd">Customize content</Text>
                                    <Text>Edit your exit-intent popups content.</Text>
                            </BlockStack>
                            <div style={{marginTop: '50px'}}>
                            <Button variant="primary" size="large" onClick={handleEditContent}>Edit content</Button>
                            </div>
                        </div>
                        <Bleed marginBlock="200" marginInline="200">
                        <img src={writeContent} style={{maxWidth: '200px', maxHeight: '200px'}}></img>
                        </Bleed>
                    </InlineStack>
                </Card>
                <Card roundedAbove="sm">
                    <InlineStack align="space-between">
                        <div style={{padding: '25px'}}>
                            <BlockStack gap="400" align="space-around">
                                    <Text as="h2" variant="headingMd">Customize styling</Text>
                                    <Text>Edit your exit-intent popups styling.</Text>
                            </BlockStack>
                            <div style={{marginTop: '50px'}}>
                            <Button variant="primary" size="large" onClick={handleEditStyle}>Edit styling</Button>
                            </div>
                        </div>
                        <Bleed marginBlock="200" marginInline="200">
                        <img src={Customize} style={{maxWidth: '200px', maxHeight: '200px'}}></img>
                        </Bleed>
                    </InlineStack>
                </Card>
                <Card roundedAbove="sm">
                    <InlineStack align="space-between">
                        <div style={{padding: '25px'}}>
                            <BlockStack gap="400" align="space-around">
                                    <Text as="h2" variant="headingMd">Edit triggers & conditions</Text>
                                    <Text>Edit your exit-intent popups triggers.</Text>
                            </BlockStack>
                            <div style={{marginTop: '50px'}}>
                            <Button variant="primary" size="large" onClick={handleEditConditions}>Edit conditions</Button>
                            </div>
                        </div>
                        <Bleed marginBlock="200" marginInline="200">
                          <img src={Conditions} style={{maxWidth: '200px', maxHeight: '200px'}}></img>
                        </Bleed>
                    </InlineStack>
                </Card>
                </BlockStack>
          </Layout.Section>
          </div>
        </Layout>
      </BlockStack>
    </Page>
  );
};
