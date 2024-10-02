import { InlineGrid } from '@shopify/polaris';
import ValueCounter from './ValueCounter';
import ConversionCounter from './ConversionCounter';
import EmailCounter from './EmailCounter'

const AnalyticsGrid = ({ totalValue, totalConversions, totalEmails  }) => {
    return (
        <InlineGrid columns="3" gap='400'>
                <ValueCounter totalValue={totalValue}/>
                <ConversionCounter totalConversions={totalConversions} />
                <EmailCounter totalEmails={totalEmails} />
        </InlineGrid>
    )
};

export default AnalyticsGrid