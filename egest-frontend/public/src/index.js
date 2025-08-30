import React from 'react';
import ReactDOM from 'react-dom';
import App from './api/App'; // Certifique-se que App.js está no mesmo nível

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
