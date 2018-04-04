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
import Linkify from 'react-linkify';
import Dialog from 'material-ui/Dialog';
import Tabs, { Tab } from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Input from 'material-ui/Input';
import { notificationEmitter } from '../Component/Notification';

import '../SCSS/TrackPage.scss';

import ListIcon from 'material-ui-icons/List';

const imageRegex = /(https?:\/\/.*\.(?:png|jpg))/ig;

const player = new Player();

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
  }

  async fetchTrack() {
    const id = this.props.match.params.id;
    const url = getApiUrl('api', `/track/${id}`);
    const response = await axios.get(url);
    if(!response.data.error){
      this.setState({
        track: response.data,
      });
      this.fetchComments();
    }
  }

  async fetchComments(){
    const url = getApiUrl('api', `/track/${this.state.track.id}/comment`);
    const response = await axios.get(url);
    if(!response.data.error){
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

  playTrack(){
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

  checkImage(text){
    const match = text.match(imageRegex) ;
    if(match){
      const googleImageUrl = googleCacheImage(match, null, 3.154e+7)
      text = text.replace(match, `<BR /> <a href="${match}" target="_blank"><img src="${googleImageUrl}" alt="Imgur image" class="commentImage"/></a> <BR />`);
    }
    return text;
  }

  eachComment(){
    const returnArray = [];
    const comments = this.state.comments;
    if(comments.length <= 0){
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
    }else{
      comments.map(comment => {
        return returnArray.push(
          <div key={comment.id}
            style={{
              color: this.state.darkTheme ? '#FFF' : '#161616',
            }}
          >
            <Link to={`/@${comment.author.username}`}>
              <Typography>@{comment.author.username}</Typography>
            </Link>
            <Typography>
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

  showLongText(){
    this.setState({
      descriptionStyle: {
        display: 'block',
      },
      descriptionButton: 'Show Less',
      descriptionOpen: true,
    });
  }

  hideLongText(){
    this.setState({
      descriptionStyle: {
        display: 'none',
      },
      descriptionButton: 'Show More',
      descriptionOpen: false,
    });
  }

  toogleDescription(){
    if(this.state.descriptionOpen){
      this.hideLongText();
    }else{
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
              <Button onClick={() => this.addToPlaylist({id: playlist.id})}>Add</Button>
            </ListItemSecondaryAction>
          </ListItem>
      )
    })
  }

  async createNewPlaylist(payload){
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

  async addToPlaylist(playlist){
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

  async fetchUserPlaylist(){
    const url = getApiUrl('api', '/me/playlists');
    const response = await axios.get(url);
    if(!response.data.error){
      this.setState({
        playlists: response.data,
      })
    }
  }

  render() {

    if(this.state.playlistIsOpen && this.state.playlistIndex === 0 && typeof this.state.playlists === 'undefined'){
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

          <Dialog onClose={() => this.setState({playlistIsOpen: false})} open={this.state.playlistIsOpen}>
            <Tabs value={this.state.playlistIndex} onChange={(e, value) => this.setState({playlistIndex: value})}>
              <Tab label="Add To Playlist" />
              <Tab label="Create New One" />
            </Tabs>
            {
              (() => {
                if(this.state.playlistIndex === 0){
                  // Add existing playlist
                  return (
                    <Typography component="div" style={{ padding: 8 * 3 }}>
                      {
                        (() => {
                          if(this.state.playlists){
                            return (
                              <List>
                                {
                                  this.eachPlaylist(this.state.playlists)
                                }
                              </List>
                            )
                          }else{
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
                if(this.state.playlistIndex === 1){
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
                      <Button onClick={() => this.createNewPlaylist({title: this.state.value, id: this.state.track.id})}>Save</Button>
                    </Typography>
                  )
                }
              })()
            }
          </Dialog>

          <div id="track_details">

            <Button
              id={'coverArt'}
              onClick={() => this.playTrack()}
            >
              <img src={googleCacheImage(getApiUrl('api', `/image/coverart/${this.state.track.id}?width=300`), 300)} alt={`${this.state.track.title} cover art`} 
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            </Button>

            <div className="text"
              style={{
                display: 'inline',
                position: 'absolute',
                top: '1em',
                marginLeft: '1em',
              }}
            >

              <Typography
                style={{
                  color: this.state.darkTheme ? '#FFF' : '#161616',
                }}
              >
                {this.state.track.title}
              </Typography>

              <Typography
                style={{
                  color: this.state.darkTheme ? '#FFF' : '#161616',
                }}
              >
                <Link id="author" to={`/user/${this.state.track.author.username}`}>
                  @{this.state.track.author.username}
                </Link>
              </Typography>

              <IconButton
                onClick={() => this.setState({playlistIsOpen: true})}
              >
                <ListIcon />
              </IconButton>

              <hr
                style={{
                  margin: '1em 0em'
                }}
               />

              <Linkify>
                <Typography component="div">
                  {
                    (() => {
                      if(this.state.track.description){
                        const lineByLine = this.state.track.description.split('\n');
                        const lines = lineByLine.length;
                        const previewLines = 3;
                        if(lines <= previewLines){
                          return (
                            <Typography>
                              {
                                renderHTML(this.state.track.description)
                              }
                            </Typography>
                          )
                        }else{
                          let preview = '';
                          for(let index = 0; index < previewLines; index++){
                              preview += lineByLine[index] + ' <BR />';
                          }
                          return (
                            <div id="readmore">
                              <Typography>
                                {
                                  renderHTML(preview)
                                }

                                <div ref={'longText'} id={'longText'} style={this.state.descriptionStyle}>
                                  {
                                    (() => {
                                        let text = '';
                                        for(let index = previewLines; index < lines; index++){
                                            text += `${lineByLine[index]} <BR />`;
                                        };
                                        return renderHTML(text);
                                    })()
                                  }
                                </div>

                                <Button
                                  style={{
                                    marginTop: '0.5em',
                                  }}
                                  onClick={e => this.toogleDescription()}
                                >
                                  {
                                    this.state.descriptionButton
                                  }
                                </Button>
                              </Typography>
                            </div>
                          )
                        }
                      }
                    })()
                  }
                </Typography>
              </Linkify>

              {
                // Comment session
                (() => {
                  if(!this.state.comments){
                    return <CircularProgress />;
                  }else{
                    return (
                      <div style={{
                        marginTop: '1em',
                        height: '15em',
                      }}>
                        <div id="comments">{this.eachComment()}</div>
                        <ComentInputField 
                          id={this.state.track.id}
                          onChange={data => this.updateCommentList(data)}
                        />
                      </div>
                    )
                  }
                })()
              }

            </div>

          </div>
        </div>
      )
    }
  }
}