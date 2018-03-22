import React from 'react';
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Switch from "material-ui/Switch";
import isDarkTheme from '../Utils/isDarkTheme';
import { emitter } from '../Component/NavBar';
import Notification from '../Component/Notification';
import { EventEmitter } from 'fbemitter';

const SettingsEmmiter = new EventEmitter();

export default class Settings extends React.Component {

  constructor(){
    super();
    this.emitter = SettingsEmmiter;
  }

  state = {
    darkTheme: isDarkTheme(),
    sync: localStorage.getItem('hs_sync') === 'true' ? true : false,
    fadeOut: localStorage.getItem('hs_fadeout') === 'true' ? true : false,
  }

  async componentDidMount(){
    this.emitter = SettingsEmmiter;
    emitter.addListener('change', darkTheme => {
      this.setState({
        darkTheme,
      });
    });
  }

  handelSync(){
    let sync = this.state.sync;
    this.setState({
      sync: !sync,
    });
    localStorage.setItem('hs_sync', !sync);
    this.notify();
    SettingsEmmiter.emit('setting.sync', !sync);
  }

  handelfadeOut(){
    let fadeOut = this.state.fadeOut;
    this.setState({
      fadeOut: !fadeOut,
    });
    localStorage.setItem('hs_sync', !fadeOut);
    this.notify();
    SettingsEmmiter.emit('setting.fadeOut', !fadeOut);
  }

  notify(){
    this.refs.notification.push({
      message: 'Your settings has been updated',
      button: 'yay',
    });
  }

  render(){

    return (
      <div>
        <Typography
          style={{
            color: this.state.darkTheme ? '#FFF' : '#161616',
          }}
        >
          Notification
          <Switch
            value="checkedB"
            color="primary"
          />
        </Typography>

        <Typography
          style={{
            color: this.state.darkTheme ? '#FFF' : '#161616',
          }}
        >
          Sync
          <Switch
            value="checkedB"
            color="primary"
            checked={this.state.sync}
            onChange={() => this.handelSync()}
          />
          <br />
          Syncing your data across devices
        </Typography>

        <Typography
          style={{
            color: this.state.darkTheme ? '#FFF' : '#161616',
          }}
        >
          Fade Out
          <Switch
            value="checkedB"
            color="primary"
            checked={this.state.fadeOut}
            onChange={() => this.handelfadeOut()}
          />
          <br />
          When you pause the track, it will fade out instead of killing immediately
        </Typography>

        <Button variant="raised" color="secondary">
          Delete Account
        </Button>

        <Notification
          ref="notification"
        ></Notification>
      </div>
    )
  }
}