// client/src/pages/CustomizerPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Customizer from '../components/Customizer';

const CustomizerPage = () => {
  const location = useLocation();
  const trackData = location.state?.trackData;

  return (
    <div>
      <Customizer trackData={trackData} />
    </div>
  );
};

export default CustomizerPage;