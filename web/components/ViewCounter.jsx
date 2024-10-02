import { Card, Text, Select, InlineStack, BlockStack, Bleed } from '@shopify/polaris';
import { useState } from 'react';

const ViewCounter = ({ viewsInPeriod, viewsInTotal }) => {

  const [billingPeriod, setBillingPeriod] = useState('period');

  const billingPeriodOptions = [
    {label: 'Billing Period', value: 'period'},
    {label: 'Total', value: 'total'},
  ];

  // Handler for changing the billing period
  const handleBillingPeriodChange = (value) => {
    setBillingPeriod(value);
  };

  const viewCount = billingPeriod === 'period' ? viewsInPeriod : viewsInTotal;
  const sinceText = billingPeriod === 'period' ? 'since billing period start' : 'in total';

  return (
    <Card sectioned>
      <BlockStack inlineAlign='end'>
        <InlineStack blockAlign='end' alignItems='end'>
        <Select
            options={billingPeriodOptions}
            onChange={handleBillingPeriodChange}
            value={billingPeriod}
          />
        </InlineStack>
        </BlockStack>
        <Bleed marginBlock="400" marginInline="400">
        <div style={{display: 'flex', height: '100%', justifyContent: 'center', justifyItems: 'center' }}>
          <BlockStack inlineAlign='center' align='center' gap="300">
          <Text as="h3" variant="heading3xl">
              {viewCount}
          </Text>
          <Text as="h3" variant="headingLg">
            Popup views
          </Text>
          <Text as="p" variant="bodyMd">{sinceText}</Text>
        </BlockStack>
        </div>
      </Bleed>
    </Card>
  );
};

export default ViewCounter;