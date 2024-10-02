import { Text, BlockStack, InlineGrid } from '@shopify/polaris';

const BillingCounter = ({ totalValue }) => {

    return (
            <BlockStack gap="200">
                    <div style={{ minHeight: "32" }}>
                        <Text as="h2" variant="headingMd">Potential revenue saved</Text>
                    </div>
                <div style={{ color: '006400' }}>
                    <Text as="h3" variant="headingLg">
                        {totalValue}$
                    </Text>
                </div>
            </BlockStack>
    );
};

export default BillingCounter;
