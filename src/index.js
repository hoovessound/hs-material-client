import React from 'react';
import ReactDom from 'react-dom';
import Routers from './Routers';
import './Utils/socketIoAuth';
import './SCSS/index.scss';
import { set } from './Utils/globalObject';

// Try to register a new service worker
import './service_worker_registration';

const disableAnimation = localStorage.getItem('hs_disable_animation') === 'true' ? true : false;
const firstPaintElement = document.querySelector('#first_paint');
const statusText = document.querySelector('#status-text');

// Actually, this owo thing means open tabs.... just so you know
const openTab = localStorage.getItem('owo');
if(openTab === 'true'){
    console.log('You have HoovesSound open in other tab');
    set('openTabs', true);
}else{
    localStorage.setItem('owo', 'true');
    window.onbeforeunload = () => {
        localStorage.setItem('owo', '');
    }
    set('openTabs', false);
    console.log('You do not have HoovesSound open in other tab');
}

document.querySelector('#first_paint .load-bar').style.display = 'none';

setTimeout(() => {
    statusText.style.display = 'block';
}, 3000);

if(disableAnimation){
    firstPaintElement.outerHTML = '';
}else{
    firstPaintElement.style.animation = 'fade-up 0.4s ease-in both';
    setTimeout(() => {
        firstPaintElement.outerHTML = '';
    }, 400);
}

ReactDom.render(<Routers />, document.getElementById('app'));