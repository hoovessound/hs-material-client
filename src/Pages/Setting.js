import React from 'react';
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Switch from "material-ui/Switch";
import isDarkTheme from '../Utils/isDarkTheme';
import { emitter } from '../Component/NavBar';
import { notificationEmitter } from '../Component/Notification';
import { EventEmitter } from 'fbemitter';
import IconButton from 'material-ui/IconButton';
import Emojify from 'react-emojione';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import Slide from 'material-ui/transitions/Slide';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}


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

    explan: {
      open: false,
      title: 'Default Title',
      context: 'Default Context',
      button: 'Cool!',
    }
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

  toogleExplan(){
    const explan = this.state.explan;
    explan.open = !explan.open;
    this.setState({
      explan,
    });
  }

  render(){

    return (
      <div>

        <Dialog open={this.state.explan.open} onClose={e => this.toogleExplan()} transition={Transition}>
          <DialogTitle >{this.state.explan.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {
                this.state.explan.context
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={e => this.toogleExplan()}>
              {
                this.state.explan.button || 'Cool!'
              }
            </Button>
          </DialogActions>
        </Dialog>

        <Typography
          style={{
            color: this.state.darkTheme ? '#FFF' : '#161616',
          }}
        >
          Notification
          <Switch
            value="checkedB"
            color="primary"
            onChange={e => {
              notificationEmitter.emit('push', {
                message: 'Push Notification Will Be Soon Implemented :grimacing:',
                button: 'YAY :tada: ',
              });
            }}
          />

          <IconButton
            onClick={() => {
              this.setState({
                explan: {
                  open: true,
                  title: 'Enabling Push Notification',
                  context: (
                    <div>
                      <ul>You will get the latest update of your beloved musician, when they upload a new track you will be notified instantly so you won't missed a single track.</ul>
                      <ul>When someone commented on your track, you also get a notified instantly, so you won't be miss out the hype</ul>
                    </div>
                  )
                }
              })
            }}
          >
            <Emojify style={{width: 23, height: 23}}>
              :thinking:
            </Emojify>
          </IconButton>

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
          <IconButton
            onClick={() => {
              this.setState({
                explan: {
                  open: true,
                  title: 'Syncing',
                  context: (
                    <div>
                      <ul>Syncing your data across devices</ul>
                      <ul>Including The Following</ul>
                      <ul>Your last play track and time</ul>
                      <ul>Personally settings like volume and notification permission</ul>
                    </div>
                  )
                }
              })
            }}
          >
            <Emojify style={{width: 23, height: 23}}>
              :thinking:
            </Emojify>
          </IconButton>
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

          <IconButton
            onClick={() => {
              this.setState({
                explan: {
                  open: true,
                  title: 'Fade out',
                  context: 'When you pause the track, it will fade out instead of killing immediately',
                }
              })
            }}
          >
          <Emojify style={{width: 23, height: 23}}>
            :thinking:
          </Emojify>
        </IconButton>
          
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
          <IconButton
            onClick={() => {
              this.setState({
                explan: {
                  open: true,
                  title: 'Disable Animations',
                  context: 'When you are using a low-end device, and you want to have a much smoother experience, disabling all fancy animations will make your device run much faster',
                }
              })
            }}
          >
            <Emojify style={{width: 23, height: 23}}>
              :thinking:
            </Emojify>
          </IconButton>
        </Typography>

      </div>
    )
  }
}