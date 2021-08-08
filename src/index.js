import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router} from 'react-router-dom';



ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
