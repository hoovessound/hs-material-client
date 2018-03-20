import React from 'react';

export default class AbsoluteCenter extends React.Component {
  render(){
    return (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          textAlign: 'center',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {this.props.children}
      </div>
    )
  }
}