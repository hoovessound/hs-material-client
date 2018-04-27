import React from 'react';
import isDarkTheme from '../Utils/isDarkTheme';
import { emitter } from '../Component/NavBar';

export default class AbsoluteCenter extends React.Component {

  state = {
    darkTheme: isDarkTheme(),
  }

  componentDidMount(){
    emitter.addListener('change', darkTheme => {
      this.setState({
        darkTheme,
      });
    });
  }

  render(){
    return (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          textAlign: 'center',
          transform: 'translate(-50%, -50%)',
          color: this.state.darkTheme ? '#FFF' : '#161616',
        }}
      >
        {this.props.children}
      </div>
    )
  }
}