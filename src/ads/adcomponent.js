import React, { useEffect } from 'react';

const AdBanner = () => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div className="ad-container">
      <ins className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3083070996659096"
        data-ad-slot="1628797541"
        data-ad-format="auto"
        data-full-width-responsive="true">
      </ins>
    </div>
  );
};

export default AdBanner;
