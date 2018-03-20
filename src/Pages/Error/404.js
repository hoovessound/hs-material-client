import React from 'react';

import '../../SCSS/404.scss';

let keyInput = [];

const requireKeys = [
  68,
  69,
  82,
  80,
  89,
];
/*
  Key enter: derpy
  Key code: 68 69 82 80 89
*/

export default class Page404 extends React.Component {

  state = {
    jackPot: false,
  }

  easterEgg(e){
    if(requireKeys.includes(e.keyCode)){
      keyInput.push(e.keyCode);
    }else{
      // Reset
      keyInput = [];
    }
    if(keyInput.length === 5){
      this.jackPotLol();
    }
  }

  jackPotLol(){
    this.refs.derpyYay.classList.add('derpy');
  }

  render(){
    window.onkeydown = e => this.easterEgg(e);
    return (
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <img src="https://derpicdn.net/img/2014/7/22/681028/medium.png" id="derpy_404" alt="Derpy~~" />
        
        <img src="https://orig00.deviantart.net/50ed/f/2011/332/f/7/derpy_hovering_test_by_c_quel-d4hmz2x.gif" 
          ref='derpyYay'
          id="derpyYay"
          alt="Derpy yay"
        />
      </div>
    )
  }
}