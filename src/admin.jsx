import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './AdminApp.jsx';
import { SiteDataProvider } from './context/SiteDataContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('admin-root')).render(
  <React.StrictMode>
    <SiteDataProvider>
      <AdminApp />
    </SiteDataProvider>
  </React.StrictMode>
);
