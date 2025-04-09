import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './global.css';
import { store } from './redux';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const isInDevelopment = import.meta.env.VITE_DEVELOPMENT === 'true';

const rootElement = document.getElementById('root')!;
ReactDOM.createRoot(rootElement).render(
  isInDevelopment ?
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
    :
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
);