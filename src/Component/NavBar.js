/*eslint no-unused-expressions: 0*/
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Switch from "material-ui/Switch";
import IconButton from "material-ui/IconButton";
import Menu, { MenuItem } from "material-ui/Menu";
import Avatar from "material-ui/Avatar";
import SwipeableDrawer from 'material-ui/SwipeableDrawer';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Tooltip from 'material-ui/Tooltip';
import cookie from 'react-cookies';
import moment from 'moment';
import axios from 'axios';
import { CircularProgress } from 'material-ui/Progress';
import { Link } from 'react-router-dom';
import isDarkTheme from '../Utils/isDarkTheme';
import { EventEmitter } from 'fbemitter';
import googleCacheImage from '../Utils/googleCacheImage';
import * as globalObject from '../Utils/globalObject';
import { SettingsEmitter } from '../Pages/Setting';
import Emojify from 'react-emojione';

// Icons
import ListIcon from 'material-ui-icons/List';
import MenuIcon from "material-ui-icons/Menu";
import FavoriteIcon from "material-ui-icons/Favorite";
import Brightness2 from "material-ui-icons/Brightness2";
import AttachMoney from "material-ui-icons/AttachMoney";
import CloudUpload from "material-ui-icons/CloudUpload";
import getApiUrl from "../Utils/getApiUrl";

export const emitter = new EventEmitter();

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
};

class MenuAppBar extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
    drawer: false,
    darkTheme: isDarkTheme(),
    user: {
      username: '',
    },
    randomKey: 0,
    navBarBackgroundTransition: localStorage.getItem('hs_disable_animation') === 'true' ? true : false,
  };
  

  async fetchUserInfo(cb){
    const response = await axios.get(getApiUrl('api', '/me'));
    if(!response.data.error){
      globalObject.set('user', response.data);
      this.setState({
        user: response.data,
      });
      if(typeof cb === 'function'){
        cb();
      }
      emitter.emit('loadUserHistory', response.data.history);
    }
  }

  componentDidMount(){
    this.updateBackgroundColor(this.state.darkTheme);
    if(cookie.load('jwt_token')){
      this.fetchUserInfo();    
    }
    SettingsEmitter.addListener('setting.disableAnimation', navBarBackgroundTransition => this.setState({navBarBackgroundTransition}));
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  toogleDrawer(){
    this.setState({
      drawer: !this.state.drawer,
    });
  }

  toogleDarkTheme(){
    const darkTheme = !this.state.darkTheme;
    emitter.emit('change', darkTheme);
    this.setState({
      darkTheme,
    });
    cookie.save('hs_dark_theme', darkTheme, {
      expires: new Date(moment().add(1, 'years').format()),
    });
    this.updateBackgroundColor(darkTheme);
  }

  updateBackgroundColor(darkTheme){
    if(darkTheme){
      document.body.style.background = '#161616';
    }else{
      document.body.style.background = '#FFF';
    }
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.toogleDrawer.bind(this)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              <Link to={'/'} style={{cursor: 'default'}}>
                HoovesSound
              </Link>
            </Typography>

            {
              (() => {
                if(cookie.load('jwt_token')){
                  return (
                    <div>

                        <IconButton>
                            <Tooltip title={'Upload Track'}>
                                <Link to={"/upload"}>
                                    <CloudUpload />
                                </Link>
                            </Tooltip>
                        </IconButton>

                      {
                        (() => {
                          if(this.state.user.username){
                            return (
                              <Tooltip title="Your Profile">
                                <IconButton>
                                  <Avatar
                                    alt={this.state.user.username + ' avatar'}
                                    src={
                                      (() => {
                                        const url = `https://api.hoovessound.ml/image/avatar/${this.state.user.username}?widht=50`;
                                        return googleCacheImage(url, 50);
                                      })()
                                    }
                                    onClick={this.handleMenu}
                                    aria-owns={open ? "menu-appbar" : null}
                                    aria-haspopup="true"
                                    style={{
                                      cursor: "pointer"
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )
                          }else{
                            return (
                                <Tooltip title="Your Profile">
                                    <CircularProgress color="secondary"/>
                                </Tooltip>
                            )
                          }
                        })()
                      }

                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right"
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right"
                        }}
                        open={open}
                        onClose={this.handleClose}
                      >
                        <MenuItem onClick={this.handleClose}>
                          <Link to={`/@${this.state.user.username}`}>
                            Profile
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={this.handleClose}>
                          <Link to={'/setting'}>
                            Setting
                          </Link>
                        </MenuItem>
                        <Link to={'/logout'}>
                          <MenuItem>Logout</MenuItem>
                        </Link>
                      </Menu>
                    </div>
                  )
                }else{
                  return (
                    <div>
                      <Tooltip title="Click to login">
                        <Link to={'/login'}>
                          <Button variant="raised">Login</Button>
                        </Link>
                      </Tooltip>
                    </div>
                  )
                }
              })()
            }
          </Toolbar>
        </AppBar>

        <SwipeableDrawer 
          anchor="left" 
          open={this.state.drawer}
          onClose={this.toogleDrawer.bind(this)}
          onOpen={this.toogleDrawer.bind(this)}
          disableDiscovery={iOS}
          disableBackdropTransition={this.state.navBarBackgroundTransition}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toogleDrawer.bind(this)}
            onKeyDown={this.toogleDrawer.bind(this)}
          >

          <List component="nav">
            
            <Link to={'/favorites'}>
              <ListItem button>
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText primary="Favorites" />
              </ListItem>
            </Link>

            <Link to={'/my/playlist'}>
              <ListItem button>
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary="Playlist" />
              </ListItem>
            </Link>

            <Link to={'/prime/about'}>
              <ListItem button>
                <ListItemIcon>
                  <AttachMoney />
                </ListItemIcon>
                <ListItemText primary="Prime Q&A" />
              </ListItem>
            </Link>

            {/*
              <ListItem button>
                <ListItemIcon>
                  <BrushIcon />
                </ListItemIcon>
                <ListItemText primary="Doodle" />
              </ListItem>
            */}

            <Tooltip title="Switching theme">
              <ListItem>
                <ListItemIcon>
                  <Brightness2 />
                </ListItemIcon>
                <ListItemText primary="Dark Theme" />
                <Switch
                  checked={this.state.darkTheme}
                  value="darkTheme"
                  color="primary"
                  onClick={this.toogleDarkTheme.bind(this)}
                  id="darkTheme"
                />
              </ListItem>
            </Tooltip>
  
            <ListItem>
              <Tooltip title={<Emojify style={{width: 17, height: 17, marginTop: 4}}> Thanks :wink:  </Emojify>}>
              <a href="https://goo.gl/forms/AcMPhirAZ9kwcwG33" target="_blank" rel="noopener noreferrer">
                <Button>
                  HoovesSound Survey
                </Button>
              </a>
              </Tooltip>
            </ListItem>

            <ListItem>
              <Typography>
              <a href="https://about.hoovessound.ml/copyright" target="_blank" rel="noopener noreferrer"
                style={{
                  margin: '0em 0.5em',
                }}
              >Copyright</a>
              <a href="https://about.hoovessound.ml/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
              </Typography>
            </ListItem>

          </List>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MenuAppBar);