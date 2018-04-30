import React from 'react';
import ReactDom from 'react-dom';
import Routers from './Routers';
import './Utils/socketIoAuth';
import './SCSS/index.scss';

const disableAnimation = localStorage.getItem('hs_disable_animation') === 'true' ? true : false;
const firstPaintElement = document.querySelector('#first_paint');
document.querySelector('#first_paint .load-bar').style.display = 'none';
if(disableAnimation){
    firstPaintElement.style.display = 'none';
}else{
    firstPaintElement.style.animation = 'fade-up 0.4s ease-in both';
}
ReactDom.render(<Routers />, document.getElementById('app'));