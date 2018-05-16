import React from 'react';
import Avatar from 'material-ui/Avatar';
import Typography from "material-ui/Typography";
import isDarkTheme from '../Utils/isDarkTheme';
import getApiUrl from '../Utils/getApiUrl';
import googleCacheImage from '../Utils/googleCacheImage';
import { emitter } from '../Component/NavBar';
import TrackContainer from '../Component/TrackContainer';
import { notificationEmitter } from '../Component/Notification';
import axios from 'axios';
import { CircularProgress } from 'material-ui/Progress';
import GridList from 'material-ui/GridList';
import * as globalObject from '../Utils/globalObject';
import isLogin from '../Utils/isLogin';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import renderHTML from 'react-render-html';

import IconButton from 'material-ui/IconButton';
import CreateIcon from 'material-ui-icons/Create';

import Slide from 'material-ui/transitions/Slide';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

export default class User extends React.Component {

  state = {
    username: '',
    darkTheme: isDarkTheme(),
    loginUser: globalObject.get('user'),
    editIsOpen: false,
    editFirstTime: false,
    profilePicture: '',
    isOwner: false,
  }

  async componentDidMount(){

    if(typeof this.state.loginUser === 'undefined'){
      // initialize load, wait for the globalObject to response with a user object
      globalObject.emitter.addListener('set', payload => {
        if(payload.name === 'user'){
          this.setState({
            loginUser: payload.object,
          });
        }  
        if(isLogin() === true && typeof this.state.loginUser !== 'undefined' && this.state.loginUser.username === this.props.match.params.username){
          this.setState({
            isOwner: true,
          });
        }
      });
    }else{
      if(isLogin() === true && typeof this.state.loginUser !== 'undefined' && this.state.loginUser.username === this.props.match.params.username){
        this.setState({
          isOwner: true,
        });
      }
    }

    

    emitter.addListener('change', darkTheme => {
      this.setState({
        darkTheme,
      });
    });

    const username = this.props.match.params.username;
    this.setState({
      username,
      profilePicture: `https://api.hoovessound.ml/image/avatar/${username}?width=50`
    }, () => {
      this.fetchTracks();
    });
  }

  async fetchTracks(){
    const responses = await Promise.all([
      axios.get(getApiUrl('api', `/user/${this.state.username}`)),
      axios.get(getApiUrl('api', `/user/${this.state.username}/tracks`)),
    ]);
    if(!responses[0].data.error){
      this.setState({
        user: responses[0].data,
        tracks: responses[1].data,
      });
    }
  }

  eachTrack(tracks){
    const returnArrays = [];
    tracks.map(track => {
      return returnArrays.push(
        <TrackContainer track={track} />
      )
    });
    return returnArrays;
  }

  async updateProfileDetails(){

    this.setState({
      editIsOpen: false,
    });

    if(this.state.edit_username){
      this.setState({
        username: this.state.edit_username,
      });
      notificationEmitter.emit('push', {
        message: 'Updated',
      });
      const url = getApiUrl('api', '/settings');
      await axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          settings: {
            full_name: this.state.edit_username,
          }
        }),
        url,
      });
    }
  }

  render(){

    return (
      <div>

        {
          (() => {
            if(this.state.editFirstTime){
              return (
                <Dialog
                  open={this.state.editIsOpen}
                  transition={Transition}
                  keepMounted
                  onClose={() => this.setState({ editIsOpen: false })}
                  onKeyDown={e => {
                    if(e.keyCode === 13){
                      // ENTER
                      this.updateProfileDetails();
                    }
                  }}
                >
                  <DialogTitle>
                    Edit Your Profile
                  </DialogTitle>

                <DialogContent>
                  <TextField
                    label="Full Name"
                    defaultValue={renderHTML(this.state.loginUser.fullname)}
                    margin="normal"
                    style={{
                      width: '40vw',
                    }}
                    onInput={e => this.setState({ edit_username: e.target.value })}
                  />
                </DialogContent>

                <DialogActions>
                  <Button onClick={() => this.setState({ editIsOpen: false })} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={() => this.updateProfileDetails()} color="primary">
                    Save
                  </Button>
                </DialogActions>

                </Dialog>
              )
            }
          })()
        }


        <div id="userInfo"
          style={{
            textAlign: 'center',
            background: this.state.user ? `url(${googleCacheImage(this.state.user.banner)}) no-repeat center` : '',
            backgroundSize: 'cover',
            padding: '0.5em',
            position: 'relative',
            margin: '0 auto',
          }}
        >
          <Avatar
            alt={this.state.username + ' avatar'}
            src={
              (() => {
                return googleCacheImage(this.state.profilePicture, 50)
              })()
            }
            style={{
              margin: '0.5em auto',
            }}
          />
          <Typography
            style={{
              color: '#161616',
            }}
          >{this.state.loginUser ? renderHTML(this.state.loginUser.fullname) : ''}</Typography>
        </div>
        
        <div id="status"
          style={{
            marginTop: '0.5em',
          }}
        >
          
          
          {/* Checks if the login in user is the author of this pag */}

          {
            (() => {
              if(this.state.isOwner){
                return (
                  <Tooltip title={'Edit'} >
                    <IconButton
                      onClick={() => this.setState({ editIsOpen: true, editFirstTime: true })}
                      style={{
                        color: this.state.darkTheme ? '#FFF' : '#161616',
                      }}
                    >
                      <CreateIcon />
                    </IconButton>
                  </Tooltip>
                ) 
              }
            })()

          }

        </div>

        <hr style={{margin: '1em 0em'}}/>

        <div id="tracks">
          {
            (() => {
              if(this.state.tracks){
                return (
                  <GridList>
                    {
                      this.eachTrack(this.state.tracks)
                    }
                  </GridList>
                )
              }else{
                return <CircularProgress />;
              }
            })()
          }
        </div>

      </div>
    )
  }
}