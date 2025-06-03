import Script from 'next/script';
import React from 'react';

const SwitchereWidget = () => {
  // Replace these with your actual values
  const partnerKey = 'YOUR_PARTNER_KEY';
  const httpReturnSuccess = 'https://yourdomain.com/success';
  const httpReturnFailed = 'https://yourdomain.com/failed';

  return (
    <div style={{ minHeight: 500, maxWidth: 450, width: '100%' }}>
      <div id="switchere" style={{ minHeight: 500, maxWidth: 450, width: '100%' }}>Loading...</div>
      <Script
        src="https://switchere.com/js/sdk-builder.js"
        strategy="afterInteractive"
        onReady={() => {
          if (window.switchereSdk) {
            window.switchereSdk.init({
              el: '#switchere',
              partnerKey,
              httpReturnSuccess,
              httpReturnFailed,
            });
          }
        }}
      />
    </div>
  );
};

export default SwitchereWidget;
