import React from 'react';
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Switch from "material-ui/Switch";
import isDarkTheme from '../Utils/isDarkTheme';
import { emitter } from '../Component/NavBar';
import { notificationEmitter } from '../Component/Notification';
import { EventEmitter } from 'fbemitter';

export const SettingsEmitter = new EventEmitter();

export default class Settings extends React.Component {

  constructor(){
    super();
    this.emitter = SettingsEmitter;
  }

  state = {
    darkTheme: isDarkTheme(),
    sync: localStorage.getItem('hs_sync') === 'true' ? true : false,
    fadeOut: localStorage.getItem('hs_fadeout') === 'true' ? true : false,
    disableAnimation: localStorage.getItem('hs_disable_animation') === 'true' ? true : false,
  }

  async componentDidMount(){
    this.emitter = SettingsEmitter;
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
    SettingsEmitter.emit('setting.sync', !sync);
  }

  handelfadeOut(){
    let fadeOut = this.state.fadeOut;
    this.setState({
      fadeOut: !fadeOut,
    });
    localStorage.setItem('hs_sync', !fadeOut);
    this.notify();
    SettingsEmitter.emit('setting.fadeOut', !fadeOut);
  }

  handleDisableAnimation(){
    let disableAnimation = this.state.disableAnimation;
    this.setState({
      disableAnimation: !disableAnimation,
    });
    localStorage.setItem('hs_disable_animation', !disableAnimation);
    this.notify();
    SettingsEmitter.emit('setting.disableAnimation', !disableAnimation);
  }

  notify(){
    notificationEmitter.emit('push', {
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

        <Typography
          style={{
            color: this.state.darkTheme ? '#FFF' : '#161616',
          }}
        >
          Disable Animatinos
          <Switch
            value="checkedB"
            color="primary"
            checked={this.state.disableAnimation}
            onChange={() => this.handleDisableAnimation()}
          />
          <br />
          When you are using a low-end device, and you want to have a much smoother experience, disabling all fancy animations will make your device run much faster
        </Typography>

      </div>
    )
  }
}