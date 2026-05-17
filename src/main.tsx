import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './i18n/LanguageProvider';
import './index.css';
import { Analytics } from "@vercel/analytics/react";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
        <Analytics />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>,
);
