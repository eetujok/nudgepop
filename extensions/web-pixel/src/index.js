import {register} from '@shopify/web-pixels-extension';

register(({analytics, settings}) => {

  analytics.subscribe('checkout_completed', (event) => {

    const checkout = event.data.checkout;
    
    const checkoutTotalPrice = checkout.totalPrice.amount;

    const payload = {
      account: settings.accountID,
      clientId: event.clientId,
      name: event.name,
      data: {
        totalPrice: checkoutTotalPrice,
      },
    };

    console.log(payload)

    fetch('https://seetext-exit-intent.gadget.app/pixels/checkout-completed', {
      method: 'POST',
      body: JSON.stringify(payload),
      keepalive: true,
    });

  });

  analytics.subscribe('seetext_popupActivation', (event) => {
    
    const payload = {
      account: settings.accountID,
      name: event.name,
      clientId: event.clientId,
    };


    console.log(payload);
    
    fetch('https://seetext-exit-intent.gadget.app/pixels/popup-activated', {
      method: 'POST',
      body: JSON.stringify(payload),
      keepalive: true,
    });

  })


});