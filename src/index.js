import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('ResizeObserver loop completed')) {
    e.stopImmediatePropagation();
  }
});