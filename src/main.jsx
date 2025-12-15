import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './components/ui';
import App from './App.jsx';
import './index.css';

// Use Vite's BASE_URL (derived from vite.config base) as the router basename.
// In production (GitHub Pages), this will be "/tech-service", so a route
// "/email-verified" actually matches "/tech-service/email-verified".
const rawBaseUrl = import.meta.env.BASE_URL || '/';
const basename =
  rawBaseUrl !== '/' ? rawBaseUrl.replace(/\/$/, '') : '';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
