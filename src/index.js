import React from 'react';
import ReactDom from 'react-dom';
import Routers from './Routers';
import './Utils/socketIoAuth';

import './SCSS/index.scss';
ReactDom.render(<Routers />, document.getElementById('app'));