import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './global.css';
import { store } from './redux';
import App from './App';

const isInDevelopment = import.meta.env.VITE_DEVELOPMENT === 'true';

const rootElement = document.getElementById('root')!;
ReactDOM.createRoot(rootElement).render(
  isInDevelopment ?
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
    :
    <Provider store={store}>
      <App />
    </Provider>
);