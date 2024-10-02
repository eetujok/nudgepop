import { Text, BlockStack, InlineGrid } from '@shopify/polaris';

const EmailCounter = ({ totalEmails }) => {

    return (
            <BlockStack gap="200">
                <InlineGrid columns="1fr auto">
                    <div style={{minHeight: "32"}}>
                        <Text as="h2" variant="headingMd">Emails gathered</Text>
                    </div>
            </InlineGrid>
                <div style={{color: '1E88E5'}}>
                    <Text as="h3" variant="headingLg">
                        {totalEmails ?? 0}
                    </Text>
                </div>
            </BlockStack>
    );
};

export default EmailCounter;
