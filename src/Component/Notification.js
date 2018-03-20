import React from 'react';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';

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
        autoHideDuration={6000}
        onClose={this.close.bind(this)}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{this.state.message}</span>}
        action={actions}
      />
    )
  }
}