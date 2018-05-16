import React from 'react';
import AbsoluteCenter from '../Component/AbsoluteCenter';
import isDarkTheme from '../Utils/isDarkTheme';
import getApiUrl from '../Utils/getApiUrl';
import googleCacheImage from '../Utils/googleCacheImage';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { emitter } from '../Component/NavBar';
import Player from '../Component/Player';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ComentInputField from '../Component/CommentInputField';
import renderHTML from 'react-render-html';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Tabs, { Tab } from 'material-ui/Tabs';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Input from 'material-ui/Input';
import { notificationEmitter } from '../Component/Notification';
import * as globalObject from '../Utils/globalObject';
import TextField from 'material-ui/TextField';
import TrackPlayerCard from '../Component/TrackPlayerCard';
import Chip from 'material-ui/Chip';
import isLogin from '../Utils/isLogin';

import '../SCSS/TrackPage.scss';

import ListIcon from 'material-ui-icons/List';
import CreateIcon from 'material-ui-icons/Create';

import Slide from 'material-ui/transitions/Slide';

const imageRegex = /(https?:\/\/.*\.(?:png|jpg))/ig;

const player = new Player();

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

export default class TrackPage extends React.Component {

  state = {
    darkTheme: isDarkTheme(),
    showMore: false,
    descriptionStyle: {
      display: 'none',
    },
    descriptionButton: 'Show More',
    descriptionOpen: false,
    playlistIsOpen: false,
    playlistIndex: 0,
    editIsOpen: false,
    isOwner: false,
  }

  async fetchTrack() {
    const id = this.props.match.params.id;
    const url = getApiUrl('api', `/track/${id}`);
    const response = await axios.get(url);
    if (!response.data.error) {
      this.setState({
        track: response.data,
      });
      let user = globalObject.get('user');
      if (user) {
        if (user.id === response.data.author.id) {
          this.setState({
            isOwner: true,
          });
        }
      } else {
        globalObject.emitter.addListener('set', payload => {
          if (payload.name === 'user') {
            if (user.id === response.data.author.id) {
              this.setState({
                isOwner: true,
              });
            }
          }
        })
      }
      this.fetchComments();
    }
  }

  async fetchComments() {
    const url = getApiUrl('api', `/track/${this.state.track.id}/comment`);
    const response = await axios.get(url);
    if (!response.data.error) {
      this.setState({
        comments: response.data,
      });
    }
  }

  componentDidMount() {
    this.fetchTrack();
    emitter.addListener('change', darkTheme => {
      this.setState({
        darkTheme,
      });
    });
  }

  playTrack() {
    const track = this.state.track;
    player.emitter.emit('play', track);
  }

  updateCommentList(data) {
    const comments = this.state.comments;
    comments.push(data);
    this.setState({
      comments,
    });
  }

  checkImage(text) {
    const match = text.match(imageRegex);
    if (match) {
      const googleImageUrl = googleCacheImage(match, null, 3.154e+7)
      text = text.replace(match, `<BR /> <a href="${match}" target="_blank"><img src="${googleImageUrl}" alt="Imgur image" class="commentImage"/></a> <BR />`);
    }
    return text;
  }

  eachComment() {
    const returnArray = [];
    const comments = this.state.comments;
    if (comments.length <= 0) {
      // No comment
      returnArray.push(
        <div>
          <Typography
            style={{
              color: this.state.darkTheme ? '#FFF' : '#161616',
            }}
          >The comment session is pretty empty</Typography>
        </div>
      )
    } else {
      comments.map(comment => {
        return returnArray.push(
          <div key={comment.id}>
            <Link to={`/@${comment.author.username}`}>
              <Typography
                style={{
                  color: this.state.darkTheme ? '#FFF' : '#161616',
                }}
              >@{comment.author.username}</Typography>
            </Link>
            <Typography
              style={{
                color: this.state.darkTheme ? '#FFF' : '#161616',
              }}
            >
              {
                renderHTML(
                  this.checkImage(comment.comment)
                )
              }
            </Typography>
          </div>
        )
      });
    }
    return returnArray;
  }

  showLongText() {
    this.setState({
      descriptionStyle: {
        display: 'block',
      },
      descriptionButton: 'Show Less',
      descriptionOpen: true,
    });
  }

  hideLongText() {
    this.setState({
      descriptionStyle: {
        display: 'none',
      },
      descriptionButton: 'Show More',
      descriptionOpen: false,
    });
  }

  toogleDescription() {
    if (this.state.descriptionOpen) {
      this.hideLongText();
    } else {
      this.showLongText();
    }
  }

  eachPlaylist(data) {
    return data.map(playlist => {
      return (
        <ListItem key={playlist.id} dense >
          <img
            src={getApiUrl('api', `/image/playlist/${playlist.id}?width=100`)}
            alt={`${playlist.title} cover art`}
            className="coverArt"
            imageStyle={{
              width: '3em',
              height: '3em',
            }}
          />
          <Link to={`/playlist/${playlist.id}`}>
            <ListItemText primary={playlist.title} />
          </Link>
          <ListItemSecondaryAction>
            <Button onClick={() => this.addToPlaylist({ id: playlist.id })}>Add</Button>
          </ListItemSecondaryAction>
        </ListItem>
      )
    })
  }

  async createNewPlaylist(payload) {
    this.setState({
      playlistIsOpen: false,
    });
    notificationEmitter.emit('push', {
      message: 'Playlist created',
      button: 'yay',
    });
    const title = payload.title;
    const id = payload.id;
    const url = getApiUrl('api', '/playlist/create');
    const response = await axios.post(url, {
      title,
      tracks: [
        id,
      ]
    });
    const playlist = response.data;
    // Update the local playlist array
    const playlists = this.state.playlists;
    playlists.push({
      id: playlist.id,
      title: playlist.title,
      author: playlist.author,
      tracks: playlist.tracks,
    });
    this.setState({
      playlists,
    });
  }

  async addToPlaylist(playlist) {
    this.setState({
      playlistIsOpen: false,
    });
    notificationEmitter.emit('push', {
      message: 'Added To Playlist',
      button: 'yay',
    });
    const url = getApiUrl('api', `/playlist/add/${playlist.id}/${this.state.track.id}?`);
    await axios.post(url);
  }

  async fetchUserPlaylist() {
    const url = getApiUrl('api', '/me/playlists');
    const response = await axios.get(url);
    if (!response.data.error) {
      this.setState({
        playlists: response.data,
      })
    }
  }

  async updateTrack() {
    let title = this.state.trackTitle;
    let description = this.state.trackDescription;
    const track = this.state.track;

    if (!title) {
      title = track.title;
    } else {
      track.title = title;
    }

    if (!description) {
      description = track.description;
    } else {
      track.description = description;
    }

    const url = getApiUrl('api', `/track/${this.state.track.id}/edit`);
    this.setState({
      track,
      editIsOpen: false,
    });
    notificationEmitter.emit('push', {
      message: 'Saved :kissing_smiling_eyes:',
    });
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    };
    await axios.post(url, form, config);
  }

  render() {

    if (this.state.playlistIsOpen && this.state.playlistIndex === 0 && typeof this.state.playlists === 'undefined') {
      this.fetchUserPlaylist();
    }

    if (!this.state.track) {
      return (
        <AbsoluteCenter>
          <CircularProgress />
          <Typography
            style={{
              color: this.state.darkTheme ? '#FFF' : '#161616',
            }}
          >Fetching track data</Typography>
        </AbsoluteCenter>
      )
    } else {
      // With track data
      return (
        <div key={this.state.track.id} id={this.state.track.id}>
          {
            (() => {
              if (this.state.isOwner) {
                return (

                  <Dialog
                    open={this.state.editIsOpen}
                    transition={Transition}
                    keepMounted
                    onClose={() => this.setState({ editIsOpen: false })}
                    onKeyDown={e => {
                      if(e.keyCode === 13){
                        // ENTER
                        if(document.activeElement.id !== 'addTagField'){
                          this.updateTrack();
                        }
                      }
                    }}
                  >
                    <DialogTitle>
                      Editing Your Track
                    </DialogTitle>
                    <DialogContent>

                      <TextField
                        label="Title"
                        defaultValue={renderHTML(this.state.track.title)}
                        margin="normal"
                        style={{
                          width: '40vw',
                        }}
                        onInput={e => this.setState({ trackTitle: e.target.value })}
                      />

                      <TextField
                        label="Description"
                        multiline
                        rows="10"
                        defaultValue={renderHTML(this.state.track.description)}
                        margin="normal"
                        style={{
                          width: '100%',
                        }}
                        onInput={e => this.setState({ trackDescription: e.target.value })}
                      />

                      {/* Tags */}


                      <div>
                        <TextField
                          label="Tag Name"
                          margin="normal"
                          style={{
                            width: '100%',
                          }}
                          id="addTagField"
                          onKeyDown={e => {
                            if(e.keyCode === 13){
                              // ENTER
                              const tag = document.activeElement.value;
                              const track = this.state.track;
                              track.tags.push(tag);
                              axios.post(getApiUrl('api', `/track/${this.state.track.id}/tag`), {
                                tag,
                              });
                              this.setState({
                                track,
                              });
                              document.activeElement.value = '';
                            }
                          }}
                        />
                        {
                          (() => {
                            const tags = [];
                            if(this.state.track.tags.length >= 1){
                              this.state.track.tags.map(tag => {
                                if(tag !== `artist:${this.state.track.author.username}`){
                                  return tags.push(
                                    <Chip
                                      label={tag}
                                      onDelete={() => {
                                        axios.delete(getApiUrl('api', `/track/${this.state.track.id}/tag`), {
                                          tag,
                                        });
                                        const track = this.state.track;
                                        const index = track.tags.indexOf(tag);
                                        if (index > -1) {
                                          track.tags.splice(index, 1);
                                        }
                                        this.setState({
                                          track,
                                        });
                                      }}
                                    />
                                  )
                                }
                                return true;
                              });
                              return tags;
                            }
                          })()
                        }
                      </div>

                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => this.setState({ editIsOpen: false })} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={() => this.updateTrack()} color="primary">
                        Save
                      </Button>
                    </DialogActions>
                  </Dialog>
                )
              }
            })()
          }

          <Dialog
            onClose={() => this.setState({ playlistIsOpen: false })}
            open={this.state.playlistIsOpen}
            transition={Transition}
          >
            <Tabs value={this.state.playlistIndex} onChange={(e, value) => this.setState({ playlistIndex: value })}>
              <Tab label="Add To Playlist" />
              <Tab label="Create New One" />
            </Tabs>
            {
              (() => {
                if (this.state.playlistIndex === 0) {
                  // Add existing playlist
                  return (
                    <Typography component="div" style={{ padding: 8 * 3 }}>
                      {
                        (() => {
                          if (this.state.playlists) {
                            return (
                              <List>
                                {
                                  this.eachPlaylist(this.state.playlists)
                                }
                              </List>
                            )
                          } else {
                            return <CircularProgress />;
                          }
                        })()
                      }
                    </Typography>
                  )
                }
              })()
            }

            {
              (() => {
                if (this.state.playlistIndex === 1) {
                  // Add existing playlist
                  return (
                    <Typography component="div" style={{ padding: 8 * 3 }}>
                      <Input
                        placeholder="Playlist Name"
                        ref="inputField"
                        onKeyDown={evt => {
                          const charCode = evt.which || evt.charCode || evt.keyCode || 0;
                          if (charCode === 13) {
                            // ENTER
                            const text = evt.target.value.trim();
                            if (text.length >= 1) {
                              // Valid
                              this.createNewPlaylist({
                                title: text,
                                id: this.state.track.id,
                              });
                            }
                          }
                        }}
                        onChange={e => {
                          this.setState({
                            value: e.target.value,
                          });
                        }}
                        value={this.state.value}
                        onPaste={e => this.onPaste(e)}
                      />
                      <br />
                      <Button onClick={() => this.createNewPlaylist({ title: this.state.value, id: this.state.track.id })}>Save</Button>
                    </Typography>
                  )
                }
              })()
            }
          </Dialog>

          <div id="track_details">

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <TrackPlayerCard track={this.state.track} />
            </div>

            <div className="text" >

              {
                (() => {
                  if(isLogin()){
                    return (
                      <Tooltip title={'Playlist'} >
                        <IconButton
                          onClick={() => this.setState({ playlistIsOpen: true })}
                          style={{
                            color: this.state.darkTheme ? '#FFF' : '#161616',
                          }}
                        >
                          <ListIcon />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                })()
              }

              {
                (() => {
                  if (this.state.isOwner) {
                    return (
                      <Tooltip title={'Edit'} >
                        <IconButton
                          onClick={() => this.setState({ editIsOpen: true })}
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


              <Slide in={true} direction="up" mountOnEnter unmountOnExit>
                {
                  // Comment session
                  (() => {
                    if (!this.state.comments) {
                      return <CircularProgress />;
                    } else {
                      return (
                        <div style={{
                          marginTop: '1em',
                          height: '15em',
                        }}>
                          <div id="comments">{this.eachComment()}</div>
                          {
                            (() => {
                              if(isLogin()){
                                return (
                                  <ComentInputField
                                    id={this.state.track.id}
                                    onChange={data => this.updateCommentList(data)}
                                  />
                                )
                              }
                            })()
                          }
                        </div>
                      )
                    }
                  })()
                }
              </Slide>

            </div>

          </div>
        </div>
      )
    }
  }
}