import React from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MoreVert from 'material-ui-icons/MoreVert';
import { playerEmitter } from './Player';
import {emitter} from './NavBar';
import isDarkTheme from '../Utils/isDarkTheme';
import { GridListTile, GridListTileBar } from 'material-ui/GridList';
import TrackMenu from './TrackMenu';
import { Link } from 'react-router-dom';
import googleCacheImage from '../Utils/googleCacheImage';

export default class TrackContainer extends React.Component {

  state = {
    darkTheme: isDarkTheme(),
    track_deatail_style: {}
  }

  componentDidMount(){
    emitter.addListener('change', darkTheme => {
      this.setState({
        darkTheme,
      });
    });
  }

  render(){

    const track = this.props.track;
    const mute = this.props.mute ? true : false;
    const className = track.backgrounddrop ? 'track_container backgrounddrop' : 'track_container';
    function coverArt(){
      return (
        <Button
          style={{
            background: (() => {
              let url = `https://api.hoovessound.ml/image/coverart/${track.id}?width=300`;
              url = googleCacheImage(url, 300);
              return `url(${url}) no-repeat center`;
            })(),
            backgroundSize: 'cover',
          }}
          className="track_cover_art"

          onClick={() => {
            playerEmitter.emit('play', {
              ...track,
              mute,
            });
          }}
        > </Button>
      )
    }

    function backgroundDrop(){
      if(track.backgrounddrop){
        return (
          <div
            style={{
              background: (() => {
                const url = `https://api.hoovessound.ml/image/doodle/${track.backgrounddrop}`;
                return `url(${url}) no-repeat center fixed`;
              })(),
              height: '100%',
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundSize: 'cover',
              zIndex: -1,
            }}
          ></div>
        )
      }else{
        return null;
      }
    }

    return (
      <GridListTile className={className} 
        onContextMenu={event => {
          event.preventDefault();
          const id = `${track.id}_menu`;
          const menu = this.refs[id];
          menu.handleClick(event)
        }}
      >
        {coverArt()}
        {backgroundDrop()}
        <GridListTileBar
          title={
            <Link to={`/track/${track.id}`}>
              {track.title}
            </Link>
          }
          subtitle={
            <Link to={`/@${track.author.username}`}>
              @{track.author.username}
            </Link>
          }
          actionIcon={
            <div>
              <IconButton>
                <MoreVert 
                  style={{
                    color: this.state.darkTheme ? '#FFF' : 'rgb(143, 67, 156)',
                  }}
                  onClick={event => {
                    const id = `${track.id}_menu`;
                    const menu = this.refs[id];
                    menu.handleClick(event)
                  }}
                />
              </IconButton>
            </div>
          }
        />
        <TrackMenu track={track} ref={track.id + '_menu'} />
      </GridListTile>
    )
  }
}