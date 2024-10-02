import React, { useState, useEffect, useCallback } from 'react';
import { Page, Card, TextField, Button, FormLayout, Grid, ChoiceList, InlineStack, Spinner, RangeSlider, Divider } from '@shopify/polaris';
import { useGadget } from '@gadgetinc/react-shopify-app-bridge';
import { useAction, useFindFirst } from '@gadgetinc/react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import TooltipPreview from '../components/TooltipPreview';
import './CreateTooltipPage.css';
import { ArrowRightIcon, SaveIcon } from '@shopify/polaris-icons';

const CreateTooltipPage = () => {

  const { appBridge, } = useGadget();
  const [heading, setHeading] = useState('You still have items left in your cart!');
  const [body, setBody] = useState('Your products are selling out fast. Get them before they are gone!');

  const [headingFontSize, setHeadingFontSize] = useState(28);
  const [headingWeight, setHeadingWeight] = useState(600);
  const [bodyFontSize, setBodyFontSize] = useState(20);
  const [bodyWeight, setBodyWeight] = useState(400);

  const [centering, setCentering] = useState(['left']);

  const [action, setAction] = useState(['checkout']);
  const [formState, setFormState] = useState('CREATE')

  const [tooltipDimensions, setTooltipDimensions] = useState({ width: 0, height: 0 });



  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] = useFindFirst(api.shopifyShop, {
    select: { 
        id: true,
        inSetup: true,
        popupContent: {
            id: true,
            heading: true,
            headingFontSize: true,
            headingWeight: true,
            body: true,
            bodyFontSize: true,
            bodyWeight: true,
            centering: true,
            toCartButton: true,
            emailForm: true,
        },
        popupStyling: {
            id: true,
            maxWidth: true,
            bodyGap: true,
            borderRadius: true,
            borderWidth: true,
            textColor: true,
            borderColor: true,
            backgroundColor: true,
            padding: true,
            backgroundImage: {
              url: true,
            }
         },
    },
  });

  useEffect(() => {
    if (shop && shop.popupContent && shop.popupContent !== null) {

      const popupData = shop.popupContent;

        setHeading(popupData.heading);
        setBody(popupData.body);
        setHeadingFontSize(popupData.headingFontSize);
        setBodyFontSize(popupData.bodyFontSize);
        setHeadingWeight(popupData.headingWeight);
        setBodyWeight(popupData.bodyWeight);
        setCentering([popupData.centering]);

        if (popupData.toCartButton) {
          setAction(['checkout']);
      };

      if (popupData.emailForm) {
          setAction(['email'])
        }


        setFormState('UPDATE')
    }
  }, [shop])

  const defaultStyling = {
    maxWidth: 340,
    borderRadius: 20,
    bodyGap: 15,
    textColor: 'rgb(255, 255, 255)',
    borderColor: '#000000',
    backgroundColor: 'rgb(76, 206, 159)',
    borderWidth: 3,
    padding: 30,
  }

  const handleCenteringChange = useCallback((value) => setCentering(value), []);
  const handleActionChange = useCallback((value) => setAction(value), []);

  const navigate = useNavigate();

  const [{ data: createData, fetching: fetchingCreateData, error: errorCreateData }, act] = useAction(api.popupContent.create);
  const [{ data: updateData, fetching: fetchingUpdateData, error: errorUpdateData }, actTwo] = useAction(api.popupContent.update);

  useEffect(() => {
    if (createData || updateData ) {
      appBridge.toast.show('Content saved', { duration: 5000 });

      if (shop.inSetup) {
        navigate("/tooltip-style")
      } else {
        navigate("/")
      }
    }
  }, [createData, updateData]);


  const handleSubmit = () => {
    let toCartButton = false;
    let emailForm = false

    if (action.includes('checkout')) {
      toCartButton = true;
    } else if (action.includes('email')) {
      emailForm = true;
    }

    const props = { 
        heading: heading,
        headingFontSize: headingFontSize,
        headingWeight: headingWeight,  
        body: body,
        bodyFontSize: bodyFontSize,
        bodyWeight: bodyWeight,
        centering: centering[0], 
        toCartButton: toCartButton,
        emailForm: emailForm,
        shop: { _link: shop.id } 
    }

    if (formState === 'CREATE') {
        act(props);
    } else {
        actTwo({id: shop.popupContent.id, ...props});
    }
    
  };

  const isButtonDisabled = !heading || !body || centering.length === 0;

  const handleBackAction = () => {
    navigate('/');
  };

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

  const styling = shop.popupStyling || defaultStyling;

  return (
    <Page
      title="Setup - Content ✏️"
      backAction={{ content: 'Tooltips', onAction: handleBackAction }}
      subtitle="Keep the content as short as possible to lightly nudge customers. You can change styling in the next step. Your themes font is inherited."
    >
    <div style={{marginBottom: '3em'}}>
      <Grid columns={{ sm: 4, md: 4, lg: 4, xl: 4 }}>
        <Grid.Cell columnSpan={{ sm: 2, md: 2, lg: 2, xl: 2 }}>
          <Card sectioned>
            <FormLayout>
              <TextField label="Heading content:" value={heading} onChange={(value) => setHeading(value)} maxLength={40} showCharacterCount autoComplete="off" />
              <RangeSlider suffix='px' label="Heading font size:" min="1" max="48" value={headingFontSize} onChange={(value) => setHeadingFontSize(value)} output />
              <RangeSlider suffix='px' label="Heading weight:" min="100" max="800" value={headingWeight} onChange={(value) => setHeadingWeight(value)} output />
              <Divider borderColor='border' />
              <TextField multiline label="Body content:" value={body} onChange={(value) => setBody(value)} maxLength={200} showCharacterCount autoComplete="off" />
                <RangeSlider suffix='px' label="Body font size:" min="1" max="48" value={bodyFontSize} onChange={(value) => setBodyFontSize(value)} output/>
                <RangeSlider suffix='px' label="Body weight:" min="100" max="800" value={bodyWeight} onChange={(value) => setBodyWeight(value)} output />
              <Divider borderColor='border' />
              <ChoiceList
                title="Centering"
                choices={[
                  { label: 'Left-Center', value: 'left' },
                  { label: 'Middle', value: 'middle' },
                  { label: 'Right-Center', value: 'right' },
                ]}
                selected={centering}
                onChange={handleCenteringChange}
              />
              <ChoiceList
                title="Call to Action"
                choices={[
                  { label: 'None', value: 'none' },
                  { label: 'Email form', value: 'email' },
                  { label: 'Go to Checkout', value: 'checkout' },
                ]}
                selected={action}
                onChange={handleActionChange}
              />
              <InlineStack align='center'>
                <Button variant='primary' size="large" fullWidth disabled={isButtonDisabled} onClick={handleSubmit} icon={formState === 'CREATE' ? ArrowRightIcon : SaveIcon} loading={fetchingCreateData || fetchingUpdateData}>
                  {formState === 'CREATE' ? 'Next step' : 'Save changes'}
                </Button>
              </InlineStack>
            </FormLayout>
            </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ sm: 2, md: 2, lg: 2, xl: 2 }}>
          <div className='centered-card full-height'>
            <TooltipPreview 
                heading={heading}
                headingFontSize={headingFontSize}
                headingWeight={headingWeight}
                body={body}
                bodyFontSize={bodyFontSize}
                bodyWeight={bodyWeight}
                centering={centering[0]}
                buyButton={action.includes('checkout')}
                emailForm={action.includes('email')}
                maxWidth={styling.maxWidth}
                bodyGap={styling.bodyGap}
                borderRadius={styling.borderRadius}
                textColor={styling.textColor}
                borderColor={styling.borderColor}
                backgroundColor={styling.backgroundColor}
                padding={styling.padding}
                borderWidth={styling.borderWidth}
                uploadedImage={styling?.backgroundImage?.url}
                onDimensionsChange={setTooltipDimensions}
              />
            </div>
          </Grid.Cell>
        </Grid>
      </div>
    </Page>
  );
};

export default CreateTooltipPage;
