import { useEffect, useState, useRef } from 'react';
import './tooltipPreview.css';
import './email/emailForm.css';

import EmailValidationComponent from './email/EmailValidationComponent.jsx'

const TooltipPreview = ({ 
  heading, 
  headingFontSize, 
  headingWeight, 
  body, 
  bodyFontSize, 
  bodyWeight, 
  centering, 
  buyButton, 
  emailForm,
  maxWidth,
  bodyGap,
  borderRadius,
  textColor,
  borderColor,
  backgroundColor,
  padding,
  borderWidth,
  uploadedImage,
  onDimensionsChange
}) => {
  const [tooltipContent, setTooltipContent] = useState({
    heading: '',
    body: '',
    headingFontSize: 25,
    headingWeight: 600,
    bodyFontSize: 20,
    bodyWeight: 400,
    centering: 'left',
    buyButton: true,
    emailForm: false,
    maxWidth: 340,
    bodyGap: 25,
    borderRadius: 20,
    textColor: '#FFFFFF',
    borderColor: '#000000',
    backgroundColor: '#4cce9f',
    padding: 30,
    borderWidth: 0
  });

  const tippyBoxRef = useRef(null);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const newContent = {
      heading,
      body,
      headingFontSize,
      headingWeight,
      bodyFontSize,
      bodyWeight,
      centering,
      buyButton,
      emailForm,
      maxWidth,
      bodyGap,
      borderRadius,
      textColor,
      borderColor,
      backgroundColor,
      padding,
      borderWidth
    };

    setTooltipContent(prevContent => 
      JSON.stringify(prevContent) === JSON.stringify(newContent) ? prevContent : newContent
    );
  }, [
    heading, 
    headingFontSize, 
    headingWeight, 
    body, 
    bodyFontSize, 
    bodyWeight, 
    centering, 
    buyButton,
    emailForm, 
    maxWidth,
    bodyGap,
    borderRadius,
    textColor,
    borderColor,
    backgroundColor,
    padding,
    borderWidth
  ]);


  
 useEffect(() => {
    if (uploadedImage) {
      if (uploadedImage instanceof File) {
        const newImageURL = URL.createObjectURL(uploadedImage);
          console.log("Uploaded file", uploadedImage)
        setImageURL(newImageURL);
      } else if (typeof uploadedImage === 'string') {
          console.log("Uploaded image url", uploadedImage)
        setImageURL(uploadedImage);
      }
    } else {
      setImageURL(null);
    }
  }, [uploadedImage]);

  useEffect(() => {
    const calculateDimensions = () => {
      if (tippyBoxRef.current) {
        const { offsetWidth, offsetHeight } = tippyBoxRef.current;
        onDimensionsChange({ width: offsetWidth, height: offsetHeight });
      }
    };

    // Initial dimension calculation
    setTimeout(calculateDimensions, 0);

    // Recalculate dimensions whenever relevant properties change
    calculateDimensions();

  }, [tooltipContent, padding, bodyGap, maxWidth]);

  const alignmentStyles = {
    left: { textAlign: 'left' },
    middle: { textAlign: 'center' },
    right: { textAlign: 'right' }
  };

  return (
    <div className="tippy-box" 
      ref={tippyBoxRef}
      style={{ 
        ...alignmentStyles[tooltipContent.centering], 
        maxWidth: tooltipContent.maxWidth,
        borderRadius: tooltipContent.borderRadius,
        color: tooltipContent.textColor,
        borderColor: tooltipContent.borderColor,
        backgroundColor: tooltipContent.backgroundColor,
        backgroundImage: imageURL ? `url(${imageURL})` : 'none',
        backgroundSize: 'cover',
        borderWidth: tooltipContent.borderWidth,
        padding: tooltipContent.padding,
        borderStyle: 'solid' 
      }}>
      <div className="tippy-content">
        <div
          style={{
            fontSize: `${tooltipContent.headingFontSize}px`,
            fontWeight: tooltipContent.headingWeight,
          }}
        >
          {tooltipContent.heading}
        </div>
        <div
          style={{
            fontSize: `${tooltipContent.bodyFontSize}px`,
            fontWeight: tooltipContent.bodyWeight,
            marginTop: tooltipContent.bodyGap,
          }}
        >
          {tooltipContent.body}
        </div>
        {tooltipContent.buyButton && <button className="button-35">Go To Checkout</button>}
        {tooltipContent.emailForm && <EmailValidationComponent />}
        <div style ={{ marginTop: '2em' }}>
          <a style={{textDecoration: 'none', color: textColor}} href="/">⚡ Speed up sales with NudgePop</a>
        </div>
      </div>
    </div>
  );
};

export default TooltipPreview;
