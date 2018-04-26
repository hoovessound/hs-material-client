import React from 'react';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import { EventEmitter } from 'fbemitter';
import Emojify from 'react-emojione';

export const notificationEmitter = new EventEmitter();

export default class Notification extends React.Component {

  state = {
    duration: 6000,
    snackbar: false,
    message: '',
    buttonMessage: '',
  }

  componentDidMount(){
    if(this.props.push){
      // Push a notification right a way
      this.push(this.props.push);
    }
    notificationEmitter.addListener('push', payload => this.push(payload));
  }

  close(){
    this.setState({
      snackbar: false,
    });
  }

  push(payload){
    this.setState({
      duration: payload.duration,
      message: payload.message,
      buttonMessage: payload.button,
      snackbar: true,
    });
  }
  render(){

    const actions = [];

    if(this.state.buttonMessage){
      actions.push(
        <Button key="undo" color="secondary" size="small" onClick={this.close.bind(this)} >
          {this.state.buttonMessage}
        </Button>
      )
    }

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.snackbar}
        autoHideDuration={this.state.duration || 6000}
        onClose={this.close.bind(this)}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={
          <Emojify style={{height: 17, width: 17}}>
            <span id="message-id">{this.state.message}</span>
          </Emojify>
        }
        action={
          <Emojify style={{height: 17, width: 17}}>
            {
              actions
            }
          </Emojify>
        }
      />
    )
  }
}