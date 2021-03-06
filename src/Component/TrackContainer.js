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
import renderHTML from 'react-render-html';

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
              const url = `https://image.hoovessound.ml/coverart/${track.id}?width=300`;
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
                const url = `https://image.hoovessound.ml/doodle/${track.backgrounddrop}`;
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
              {
                renderHTML(track.title)
              }
            </Link>
          }
          subtitle={
            <Link to={`/@${track.author.username}`}>
              @{renderHTML(track.author.username)}
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