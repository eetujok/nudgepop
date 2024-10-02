import { useState, useEffect } from 'react';
import { Page, Card, Button, FormLayout, Grid, Text, Spinner, ColorPicker, Divider, RangeSlider, hsbToHex } from '@shopify/polaris';
import { useGadget } from '@gadgetinc/react-shopify-app-bridge';
import { useAction, useFindFirst } from '@gadgetinc/react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import TooltipPreview from '../components/TooltipPreview';
import './CreateTooltipPage.css';
import { ArrowRightIcon, SaveIcon } from '@shopify/polaris-icons';
import DropZoneWithImageFileUpload from '../components/ImageDrop.jsx'


const StylingTooltipPage = () => {

  const { appBridge } = useGadget();

  const [width, setWidth] = useState(340)
  const [gap, setGap] = useState(15)
  const [borderRadius, setBorderRadius] = useState(20)
  const [borderWidth, setBorderWidth] = useState(3)
  const [padding, setPadding] = useState(30)

  const [textColor, setTextColor] = useState({
    hue: 0,
    brightness: 100,
    saturation: 0,
  })

  const [textColorChanged, setTextColorChanged] = useState(false);

  const [cssString, setCssString] = useState('');


  const [backgroundColor, setBackgroundColor] = useState({
    hue: 16,
    brightness: 100,
    saturation: 100,
  })

  const [backgroundColorChanged, setBackgroundColorChanged] = useState(false);

  const [borderColor, setBorderColor] = useState({
    hue: 0,
    brightness: 0,
    saturation: 0,
  })

  const [borderColorChanged, setBorderColorChanged] = useState(false);

  const onTextColorChange = (newColor) => {
    setTextColor(newColor);
    setTextColorChanged(true);
  };
  
  const onBackgroundColorChange = (newColor) => {
    setBackgroundColor(newColor);
    setBackgroundColorChanged(true);
  };
  
  const onBorderColorChange = (newColor) => {
    setBorderColor(newColor);
    setBorderColorChanged(true);
  };

  const [uploadedImage, setUploadedImage] = useState(null);

  const onFileUpload = (file) => {
    
    setUploadedImage(file); 

  };

  const handleClearImage = () => {
    onFileUpload(null)
  }

  const [tooltipDimensions, setTooltipDimensions] = useState({ width: 0, height: 0 });


  const [formState, setFormState] = useState('CREATE')

  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] = useFindFirst(api.shopifyShop, {
    select: {
         id: true,
         inSetup: true,
         popupContent: {
            heading: true,
            headingFontSize: true,
            headingWeight: true,
            body: true,
            bodyFontSize: true,
            bodyWeight: true,
            centering: true,
            toCartButton: true,
            couponCode: true,
            emailForm: true
        },
         popupStyling: {
            id: true,
            maxWidth: true,
            bodyGap: true,
            borderRadius: true,
            textColor: true,
            borderWidth: true,
            textColorHsba: true,
            borderColor: true,
            borderColorHsba: true,
            backgroundColor: true,
            backgroundColorHsba: true,
            backgroundImage:{
              url: true
            },
            padding: true,
            customCss: true,
         },
        },
  });

  useEffect(() => {

    if (shop && shop.popupStyling && shop.popupStyling !== null) {

        const popupStyling = shop.popupStyling

        setWidth(popupStyling.maxWidth)
        setGap(popupStyling.bodyGap)
        setBorderRadius(popupStyling.borderRadius)
        setBorderWidth(popupStyling.borderWidth)
        setPadding(popupStyling.padding)
        setTextColor(popupStyling.textColorHsba)
        setBackgroundColor(popupStyling.backgroundColorHsba)
        setBorderColor(popupStyling.borderColorHsba)
        setUploadedImage(popupStyling?.backgroundImage?.url)
        setCssString(popupStyling?.customCss)
      
        setFormState('UPDATE')
        
    }
  }, [shop])

  const navigate = useNavigate();

  const [{ data: createData, fetching: fetchingCreateData, error: errorCreateData }, act] = useAction(api.popupStyling.create);
  const [{ data: updateData, fetching: fetchingUpdateData, error: errorUpdateData }, actTwo] = useAction(api.popupStyling.update);

  useEffect(() => {
    if (createData || updateData ) {
      appBridge.toast.show('Styling Saved', { duration: 5000 });
      if (shop.inSetup) {
        navigate("/tooltip-conditions")
      } else {
        navigate("/")
      }
    }
  }, [createData, updateData]);



  const handleSubmit = () => {

    const props = {
        maxWidth: width,
        bodyGap: gap,
        borderRadius: borderRadius,
        textColor: textColorChanged ? hsbToHex(textColor) : (shop?.popupStyling?.textColor ?? 'rgb(255, 255, 255)'),
        textColorHsba: textColor,
        borderColor: borderColorChanged ? hsbToHex(borderColor) : (shop?.popupStyling?.borderColor ?? '#000000'),
        borderColorHsba: borderColor,
        borderWidth: borderWidth,
        backgroundColor: backgroundColorChanged ? hsbToHex(backgroundColor) : (shop?.popupStyling?.backgroundColor ?? 'rgb(76, 206, 159)'),
        backgroundColorHsba: backgroundColor,
        padding: padding,
        customCss: cssString,
        shop: { _link: shop.id },
    }

    if (formState === 'CREATE') {
      act({ backgroundImage: uploadedImage ? ({ file: uploadedImage }) : null, ...props });
    } else {
        if (uploadedImage && uploadedImage instanceof File) {
          actTwo({id: shop.popupStyling.id, backgroundImage: uploadedImage ? ({ file: uploadedImage }) : null, ...props });
        } else if (uploadedImage && typeof uploadedImage === 'string') {
          actTwo({ id: shop.popupStyling.id, ...props })
        } else {
          actTwo({ id: shop.popupStyling.id, backgroundImage: null, ...props })
      }
    }

  };


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

  return (
    <Page
      title="Setup - Styling 🎨"
      backAction={{ content: 'Tooltips', onAction: handleBackAction }}
      subtitle="Customize the popup to your liking. Minimize clutter and use mellow colors to minimize annoyance."
    >
    <div style={{marginBottom: '3em'}}>
      <Grid columns={{ sm: 4, md: 4, lg: 4, xl: 4 }}>
        <Grid.Cell columnSpan={{ sm: 2, md: 2, lg: 2, xl: 2 }}>
          <Card sectioned>
            <FormLayout>
            <Text as='h2' variant='headingMd'>Content styling</Text>
            <FormLayout.Group>
              <RangeSlider suffix='px' min="1" max="100" output label="Heading/body gap:" value={gap} autoSize onChange={(value => setGap(value))}></RangeSlider>
            </FormLayout.Group>
            <RangeSlider suffix='px' min="0" max="60" output label="Padding:" value={padding} autoSize onChange={(value => setPadding(value))}></RangeSlider>
            <div>
                <Text as="p" variant="bodyMd">Text color:</Text>           
                <div style={{ marginTop: '0.25rem' }}>
                    <ColorPicker onChange={onTextColorChange} fullWidth color={textColor} />
                </div>
            </div>
            <Divider borderColor='border'></Divider>
            <Text as='h2' variant='headingMd'>Background image</Text>
            <Text as='p' variant='bodyMd'>Uploaded images will be filled inside the popup. Please upload an image with the same width and height as the popup to ensure proper display.</Text>
            <Text as='p' variant='bodyMd'>Popup size: <strong>{tooltipDimensions.width}px x {tooltipDimensions.height}px</strong></Text>
            <DropZoneWithImageFileUpload onFileUpload={onFileUpload} />
            {uploadedImage && (
              <Button variant="plain" tone="critical" onClick={handleClearImage}>Remove image</Button>
            )}
            <Divider borderColor='border'></Divider>
            <Text as='h2' variant='headingMd'>Popup styling</Text>
            <RangeSlider suffix='px' min="250" max="400" output label="Width:" value={width} autoSize onChange={(value => setWidth(value))}></RangeSlider>
                    <div>
                        <Text as="p" variant="bodyMd">Background color:</Text>
                        <div style={{ marginTop: '0.25rem' }}>
                            <ColorPicker fullWidth onChange={onBackgroundColorChange} color={backgroundColor} />
                        </div>
                    </div>
                    <div>
                        <Text as="p" variant="bodyMd">Border color:</Text>
                        <div style={{ marginTop: '0.25rem' }}>
                            <ColorPicker fullWidth onChange={onBorderColorChange} color={borderColor} />  
                        </div>
                    </div>
                <RangeSlider suffix='px' min="0" max="50" output label="Border radius:" value={borderRadius} autoSize onChange={(value => setBorderRadius(value))}></RangeSlider>           
                <RangeSlider suffix='px' min="0" max="20" output label="Border width:" value={borderWidth} autoSize onChange={(value => setBorderWidth(value))}></RangeSlider>
            <Button variant='primary' size="large" fullWidth onClick={handleSubmit} icon={formState === 'CREATE' ? ArrowRightIcon : SaveIcon} loading={fetchingCreateData || fetchingUpdateData}>
                 {formState === 'CREATE' ? 'Next step' : 'Save changes'}
                </Button>
            </FormLayout>
          </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ sm: 2, md: 2, lg: 2, xl: 2 }}>
            <div className='centered-card full-height'>
            <TooltipPreview 
                heading={shop.popupContent.heading}
                headingFontSize={shop.popupContent.headingFontSize}
                headingWeight={shop.popupContent.headingWeight}
                body={shop.popupContent.body}
                bodyFontSize={shop.popupContent.bodyFontSize}
                bodyWeight={shop.popupContent.bodyWeight}
                centering={shop.popupContent.centering}
                buyButton={shop.popupContent.toCartButton}
                emailForm={shop.popupContent.emailForm}
                couponCode={shop.popupContent.couponCode}
                maxWidth={width}
                bodyGap={gap}
                borderRadius={borderRadius}
                textColor={hsbToHex(textColor)}
                borderColor={hsbToHex(borderColor)}
                backgroundColor={hsbToHex(backgroundColor)}
                padding={padding}
                borderWidth={borderWidth}
                uploadedImage={uploadedImage ? uploadedImage : null}
                onDimensionsChange={setTooltipDimensions}
              />
            </div>
        </Grid.Cell>
        </Grid>
      </div>
    </Page>
  );
};

export default StylingTooltipPage;
