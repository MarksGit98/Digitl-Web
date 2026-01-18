import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';
import ContactScreen from './screens/ContactScreen';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyScreen />} />
        <Route path="/how-to-play" element={<HowToPlayScreen />} />
        <Route path="/contact" element={<ContactScreen />} />
      </Routes>
    </BrowserRouter>
    <Analytics />
  </React.StrictMode>
);

