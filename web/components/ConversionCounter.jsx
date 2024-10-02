import { Text, BlockStack, InlineGrid } from '@shopify/polaris';

const BillingCounter = ({ totalConversions }) => {

    return (
            <BlockStack gap="200">
                <InlineGrid columns="1fr auto">
                    <div style={{minHeight: "32"}}>
                        <Text as="h2" variant="headingSm">Total carts saved</Text>
                    </div>
                </InlineGrid>
                 <div style={{color: '1E88E5'}}>
                <Text as="h3" variant="headingLg">
                    {totalConversions}
                </Text>
                </div>
            </BlockStack>
    );
};

export default BillingCounter;
