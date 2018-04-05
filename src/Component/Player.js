/* eslint-disable */
import React from 'react';
import '../SCSS/Player.scss';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import PlayIcon from 'material-ui-icons/PlayArrow';
import PauseIcon from 'material-ui-icons/Pause';
import SyncIcon from 'material-ui-icons/Sync';
import Icon from 'material-ui/Icon';
import ReactSimpleRange from 'react-simple-range';
import isDarkTheme from '../Utils/isDarkTheme';
import googleCacheImage from '../Utils/googleCacheImage';
import { EventEmitter } from 'fbemitter';
import { emitter } from './NavBar';
import axios from 'axios';
import SettingPage from '../Pages/Setting';
import getApiUrl from '../Utils/getApiUrl';
import * as socketIoAuth from '../Utils/socketIoAuth';
import { CircularProgress } from 'material-ui/Progress';
import Emojify from 'react-emojione';

import Fade from 'material-ui/transitions/Fade';

const settingPage = new SettingPage();
export const playerEmitter = new EventEmitter();
const audio = new Audio();
let currentId;
let updateLastPlayEvent;
let playlistIndex = 0; // The current playing track indexes

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (secs < 10) {
    secs = '0' + secs;
  }
  return minutes + ':' + secs;
}

export default class Player extends React.Component {

  state = {
    currentTime: '0:00',
    duration: '0:00',
    track: {},
    playIcon: <PlayIcon />,
    timeLineMax: 100,
    timeLineValue: 0,
    darkTheme: isDarkTheme(),
    sync: localStorage.getItem('hs_sync') === 'true' ? true : false,
    fadeOut: localStorage.getItem('hs_fadeout') === 'true' ? true : false,
    seeking: false,

    // Local playlist
    playlistPointers: [], // Store all the tracks IDs for reference
    playlistTracks: [], // Store all the track details
  }

  fadeOut(){
    const initVolume = audio.volume;
    let actualVolume = audio.volume;
    let fadeOutInterval = setInterval(function(){
        actualVolume = (parseFloat(actualVolume) - 0.1).toFixed(1);
        if(actualVolume >= 0){
          audio.volume = actualVolume;
        } else {
          audio.pause();
          audio.volume = initVolume;
          clearInterval(fadeOutInterval);
        }
    }, 30);
  }

  addTrackIntoLocalPlaylist(tracks){
    const playlistPointers = this.state.playlistPointers;
    const playlistTracks = this.state.playlistTracks;
    // Check for duplicates
    tracks.map(track => {
      if(!playlistPointers.includes(track.id)){
        // No duplicates
        playlistPointers.push(track.id);
        playlistTracks.push(track);
      }
    });
    console.log(playlistTracks);
  }

  hotKey(evt) {
    const active = document.activeElement;
    const charCode = evt.which || evt.charCode || evt.keyCode || 0;
    let action = true;
    // Check if the element is an input or textarea field
    if (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') {
      // Check if the input element have an ID call #time
      if (active.id !== 'time') {
        action = false;
      }
    }

    if (action) {
      evt.preventDefault();
      if (charCode === 32) {
        // Space bar
        this.playMusic(this.state.track);
      }
    }
  }

  async loadUserHistory(history){
    const url = getApiUrl('api', `/track/${history.trackID}`);
    const response = await axios.get(url);
    if(!response.data.error){
      this.setState({
        track: response.data,
      });
    }
  }

  componentDidMount() {
    window.addEventListener('offline', () => {
      this.refs.networkStatusBar.classList.add('offline');
      this.refs.hs_track_player.classList.add('offline');
    });

    window.addEventListener('online', () => {
      this.refs.networkStatusBar.classList.remove('offline');
      this.refs.hs_track_player.classList.remove('offline');
    });

    window.onkeydown = (event) => this.hotKey(event);
    playerEmitter.addListener('play', track => {
      if(track.mute){
        audio.muted = true;
      }
      this.setState({
        track,
      }, () => this.playMusic(track));
    });

    socketIoAuth.getSocket().on('user.track.update', track => {
      if(currentId !== track.track.id){
        // New track
        currentId = track.track.id;
        audio.src = `https://stream.hoovessound.ml/${track.track.id}`;
        this.setState({
          track: track.track,
        })
      }
      this.setState({
        timeLineValue: track.playtime.currentTime,
        currentTime: formatTime(track.playtime.currentTime),

        timeLineMax: track.playtime.duration,
        duration: formatTime(track.playtime.duration),
        playIcon: <SyncIcon />,
      })
    });

    playerEmitter.addListener('localplaylist.add', tracks => this.addTrackIntoLocalPlaylist(tracks));

    audio.ontimeupdate = () => {

      if(this.state.sync){
        socketIoAuth.getSocket().emit('user.sync.track', {
          volume: audio.volume,
          track: this.state.track,
          playtime: {
              currentTime: audio.currentTime,
              duration: audio.duration,
          },
          isPlaying: !audio.paused,
        });
      }
      
      this.setState({
        timeLineMax: audio.duration,
        timeLineValue: audio.currentTime,
      });

      this.setState({
        currentTime: formatTime(audio.currentTime),
      });
    }

    audio.onloadedmetadata = () => {
      this.setState({
        duration: formatTime(audio.duration),
      });
    }

    audio.onplay = () => {
      this.setState({
        playIcon: <PauseIcon />
      });
    }

    audio.onpause = () => {
      this.setState({
        playIcon: <PlayIcon />
      });
    }

    audio.oncanplay = () => {
      this.setState({
        seeking: false,
      });
    }

    audio.onwaiting = () => {
      this.setState({
        seeking: true,
      });
    }

    audio.onended = () => {
      // Play the next track on the local playlsit
      this.playlistNextTrack();
    }


    emitter.addListener('change', darkTheme => {
      this.setState({
        darkTheme,
      });
    });

    settingPage.emitter.addListener('setting.sync', sync => {
      this.setState({
        sync,
      });
    });

    settingPage.emitter.addListener('setting.fadeOut', fadeOut => {
      this.setState({
        fadeOut,
      });
    });

    emitter.addListener('loadUserHistory', history => this.loadUserHistory(history));
  }

  playlistNextTrack(){
    playlistIndex = (playlistIndex + 1);
    this.playMusic(this.state.playlistTracks[playlistIndex]);
  }

  playlistPreviousTrack(){
    playlistIndex = (playlistIndex - 1);
    this.playMusic(this.state.playlistTracks[playlistIndex]);
  }

  async playMusic(track, sync=false) {
    // Update the local playlist indexes
    playlistIndex = this.state.playlistPointers.indexOf(track.id);

    if(this.state.sync){
      if (updateLastPlayEvent) clearTimeout(updateLastPlayEvent);
      updateLastPlayEvent = setTimeout(() => {
          axios.post(getApiUrl('api', `/events`), {
              event: 'UPDATE_LAST_PLAY',
              payload: {
                  volume: audio.volume,
                  trackID: track.id,
                  playtime: {
                      currentTime: audio.currentTime,
                      duration: audio.duration,
                  },
                  isPlaying: !audio.paused,
              }
          });
      }, 750);
    }

    if (currentId !== track.id) {
      // New track
      currentId = track.id;
      audio.src = `https://stream.hoovessound.ml/${track.id}`;
      this.setState({
        duration: '0:00',
      });

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.author_fullName,
          artwork: [
            {
              src: getApiUrl('api', `/image/coverart/${track.id}&width=96`),
              sizes: '96x96',
            },
            {
              src: getApiUrl('api', `/image/coverart/${track.id}&width=128`),
              sizes: '128x128',
            },
            {
              src: getApiUrl('api', `/image/coverart/${track.id}&width=192`),
              sizes: '192x192',
            },
            {
              src: getApiUrl('api', `/image/coverart/${track.id}&width=256`),
              sizes: '256x256',
            },
            {
              src: getApiUrl('api', `/image/coverart/${track.id}?width=384`),
              sizes: '384x384',
            },
            {
              src: getApiUrl('api', `/image/coverart/${track.id}?width=512`),
              sizes: '512x512',
            },
          ]
        });
      }
    }

    if ('mediaSession' in navigator) {

      navigator.mediaSession.setActionHandler('play', () => {
        audio.play();
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        if(this.state.fadeOut){
          this.fadeOut();
        }else{
          audio.pause();
        }
      });

      navigator.mediaSession.setActionHandler('previoustrackplay', () => {
        this.playlistPreviousTrack();
      });

      navigator.mediaSession.setActionHandler('previoustrackplay', () => {
        this.playlistNextTrack();
      });
      
    }

    if (audio.paused) {
      await audio.play();
    } else {
      if(this.state.fadeOut){
        this.fadeOut();
      }else{
        await audio.pause();
      }
    }
  }

  render() {
    return (
      <div 
        id="hs_track_player"
        ref="hs_track_player"
        style={{
          background: this.state.darkTheme ? '#2f2f2f' : '#8f439c',
        }}
      >
        <div className="coverart"
          style={{
            background: (() => {
              const url = getApiUrl('api', `/image/coverart/${this.state.track.id}?width=100`);
              return `url(${url}) no-repeat center`;
            })(),
            filter: this.state.seeking ? 'blur(2px)' : 'blur(0px)',
          }}
        >
        </div>
        <div id="hs_player_context">

          <ReactSimpleRange
            id="hs_track_time_line"
            ref="hs_track_time_line"
            min={0}
            max={this.state.timeLineMax}
            value={this.state.timeLineValue}
            onChange={e => {
              audio.currentTime = e.value;
            }}
          />

          <div id="track_metadata">
            <Typography
              style={{
                color: '#e5e5e5',
                fontSize: '0.8em',
              }}
            >{this.state.track.author ? '@' + this.state.track.author.username : ''}</Typography>

            <Typography
              style={{
                color: '#CCC',
                fontSize: '1em',
              }}
              noWrap={true}
              id="title"
            >{this.state.track.title || ''}</Typography>
          </div>

          <div id="#track_time_stamp">
            <Typography>
              <span>{this.state.currentTime}</span>
              <span> / </span>
              <span>{this.state.duration}</span>
            </Typography>
          </div>

          <Button 
            variant="fab" 
            color="primary" 
            id="playPauseButton"
            onClick={() => this.playMusic(this.state.track)}
          >
            {this.state.playIcon}
          </Button>
        </div>
        {/* Offline status */}
        <div id="networkStatusBar" ref="networkStatusBar">
            <Typography>
              Offline
              <Emojify style={{height: 17, width: 17}}>
                :neutral_face:
              </Emojify>
            </Typography>
        </div>
      </div>
    )
  }
}
