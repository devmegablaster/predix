import React, { useEffect, useRef } from 'react';

const BridgeModal = () => {
  const jupiterContainerRef = useRef(null);

  useEffect(() => {
    const loadJupiterScript = () => {
      const script = document.createElement('script');
      script.src = 'https://terminal.jup.ag/main-v1.js';
      script.async = true;

      script.onload = () => {
        if (jupiterContainerRef.current) {
          window.Jupiter.init({
            endpoint: 'https://api.mainnet-beta.solana.com',
            displayMode: 'modal',
            container: jupiterContainerRef.current,
            containerStyles: { zIndex: 100 },
          });
        }
      };

      document.body.appendChild(script);
    };

    loadJupiterScript();
  }, []);

  return (
    <div className="flex flex-col space-y-3 w-full h-full">
      <div
        ref={jupiterContainerRef}
        className="w-full h-full flex flex-col space-y-3 p-2 border-[#333333] rounded-lg border"
      >
      </div>
    </div>
  );
};

export default BridgeModal;
