import React, { useState, useEffect, useCallback } from 'react';
import { Page, Card, Spinner, Layout, Text, Checkbox, FormLayout, Divider, InlineStack, Button, TextField } from '@shopify/polaris';
import { useGadget } from '@gadgetinc/react-shopify-app-bridge';
import { useAction, useFindFirst } from '@gadgetinc/react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import './CreateTooltipPage.css';
import { ArrowRightIcon, SaveIcon } from '@shopify/polaris-icons';

const CreateTooltipPage = () => {

  const { appBridge } = useGadget();
  const navigate = useNavigate()

  const [alwaysChecked, setAlwaysChecked] = useState(false)
  const [cartChecked, setCartChecked] = useState(true)
  const [emailCondChecked, setEmailCondChecked] = useState(false)

  const [timeCheck, setTimeCheck] = useState(false)
  const [timeValue, setTimeValue] = useState('20')

  const [scrollCheck, setScrollCheck] = useState(false)
  const [scrollValue, setScrollValue] = useState('40')

  const [formState, setFormState] = useState('CREATE')

  const handleAlwaysChange = (value) => {
    setAlwaysChecked(value);
    if (value) {
      setCartChecked(false);
    }
  };

  const handleCartChange = (value) => {
    setCartChecked(value);
    if (value) {
      setAlwaysChecked(false);
    }
  };

  const handleEmailConditionChange = (value) => {
    setEmailCondChecked(value);
  };

  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] = useFindFirst(api.shopifyShop, {
    select: { 
        id: true,
        inSetup: true,
        popupConditions: {
            id: true,
            triggerCartAbandon: true,
            triggerAlways: true,
            conditionTime: true,
            conditionScroll: true
        }
    },
  });

  const [{ data: createData, fetching: fetchingCreateData, error: errorCreateData }, act] = useAction(api.popupConditions.create);
  const [{ data: updateData, fetching: fetchingUpdateData, error: errorUpdateData }, actTwo] = useAction(api.popupConditions.update);

  useEffect(() => {

    if (shop && shop.popupConditions && shop.popupConditions !== null) {
        
        const popConds = shop.popupConditions

        setAlwaysChecked(popConds.triggerAlways);
        setCartChecked(popConds.triggerCartAbandon);
        
        if (popConds.conditionTime !== '') {
            setTimeCheck(true);
            setTimeValue(popConds.conditionTime);
        }

        if (popConds.conditionScroll !== '') {
            setScrollCheck(true);
            setScrollValue(popConds.conditionScroll)
        }

        setFormState('UPDATE')

    }

  }, [shop])

  const handleSubmit = () => {

    const props = {
            triggerCartAbandon: cartChecked,
            triggerAlways: alwaysChecked,
            conditionTime: timeCheck ? timeValue : '',
            conditionScroll: scrollCheck ? scrollValue : '',
            shop: {
                _link: shop.id
            }
    }

    if (formState === 'CREATE') {
        act(props);
    } else {
        actTwo({id: shop.popupConditions.id, ...props})
    }
  }

  useEffect(() => {
    if (createData || updateData ) {
      appBridge.toast.show('Conditions Saved', { duration: 5000 });
      if (shop.inSetup) {
        navigate("/plans")
      } else {
        navigate("/")
      }
    }
  }, [createData, updateData]);

  const handleBackAction = () => {
    navigate('/');
  };

  const isNextStepButtonDisabled = () => {
    if (timeCheck && !timeValue) return true;
    if (scrollCheck && !scrollValue) return true;
    return false;
  };

  const isButtonDisabled = (timeCheck && !timeValue) || (scrollCheck && !scrollValue);

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
    <Page 
        title='Setup - Triggers & conditions 📋'
        subtitle='Set the triggers, when your cursor popup will show to your customers. The cart abandonment trigger is recommended.'
        backAction={{ content: 'Previous page', onAction: handleBackAction}}
    >
        <Layout>
            <div style={{maxWidth: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Layout.Section>
                <div style={{marginBottom: '2em'}}>
                <Card>
                <div style={{padding: '20px'}}>
                    <FormLayout>
                        <Text as="h1" variant='headingMd'>Popup triggers:</Text>
                        <div style={{backgroundColor: '#F6F6F6', padding: '15px', borderRadius: '0.6em'}}>
                            <Text as="p" variant='bodyMd'>Trigger when a customer has an item in their cart, and is navigating out of the page. <strong>Recommended</strong></Text>
                            <div style={{marginTop: '10px'}}>
                            <Checkbox
                                label="Cart abandonment"
                                checked={cartChecked}
                                onChange={handleCartChange}
                                fill
                            ></Checkbox>
                            </div>
                        </div>
                        <div style={{backgroundColor: '#F6F6F6', padding: '15px', borderRadius: '0.6em'}}>
                            <Text as="p" variant='bodyMd'>Trigger always, when a customer is leaving the page. Conditions for this option are recommended.</Text>
                            <div style={{marginTop: '10px'}}>
                            <Checkbox
                                label="Always"
                                checked={alwaysChecked}
                                onChange={handleAlwaysChange}
                                fill
                            ></Checkbox>
                            </div>
                        </div>
                        <Divider borderColor='border'></Divider>
                        
                        <Text as="h1" variant='headingMd'>Time & scrolling conditions:</Text>
                        <div style={{backgroundColor: '#F6F6F6', padding: '15px', borderRadius: '0.6em'}}>
                            <Text as="p" variant='bodyMd'>Triggers only after a customer has spent over a specific time on your page.</Text>
                            <div style={{marginTop: '10px'}}>
                            <Checkbox
                                label="Time Spent"
                                checked={timeCheck}
                                onChange={(value) => {
                                  setTimeCheck(value);
                                  setTimeValue('');
                                }}
                                fill
                            ></Checkbox>
                            <div style={{marginTop: '1em', marginBottom: '1em'}}>
                                <Divider></Divider>
                            </div>
                            <div style={{marginTop: '1.5em', maxWidth: '30%'}}>
                                <TextField autoComplete='off' label="Time spent on page:" autoSize suffix="seconds" type='number' value={timeValue} onChange={(value) => setTimeValue(value)} disabled={!timeCheck}></TextField>
                            </div>
                            </div>
                        </div>
                        <div style={{backgroundColor: '#F6F6F6', padding: '15px', borderRadius: '0.6em'}}>
                            <Text as="p" variant='bodyMd'>Triggers only after the user has scrolled a portion of your page.</Text>
                            <div style={{marginTop: '10px'}}>
                            <Checkbox
                                label="Amount scrolled"
                                checked={scrollCheck}
                                onChange={(value) => {
                                  setScrollCheck(value);
                                  setScrollValue('')
                                }}
                                fill
                            ></Checkbox>
                            <div style={{marginTop: '1em', marginBottom: '1em'}}>
                                <Divider></Divider>
                            </div>
                            <div style={{marginTop: '1.5em', maxWidth: '30%'}}>
                                <TextField max={100} autoComplete='off' autoSize label="Page scroll percentage:" suffix="%" type='number' value={scrollValue} onChange={(value) => setScrollValue(value)} disabled={!scrollCheck}></TextField>
                            </div>
                            </div>
                        </div>
                        <InlineStack align='center'>
                        
                                <div style={{width: '60%', marginTop: '1em'}}>
                      <Button size='large' fullWidth icon={formState === 'CREATE' ? ArrowRightIcon : SaveIcon} disabled={isButtonDisabled} loading={fetchingCreateData || fetchingUpdateData} onClick={handleSubmit} variant='primary'>
                                        {formState === 'CREATE' ? 'Next step' : 'Save changes'}
                                    </Button>
                                </div>
                        </InlineStack>
                    </FormLayout>
                  </div>
                </Card>
                </div>
            </Layout.Section>
            </div>
        </Layout>
    </Page>

  );
};

export default CreateTooltipPage;
