import React from 'react';
import isDarkTheme from '../../Utils/isDarkTheme';
import { emitter } from '../../Component/NavBar';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import AbsoluteCenter from '../../Component/AbsoluteCenter';
import axios from 'axios';
import getApiUrl from '../../Utils/getApiUrl';
import googleCacheImage from '../../Utils/googleCacheImage';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import { Link } from 'react-router-dom';

export default class MyPlaylist extends React.Component {

    state = {
      darkTheme: isDarkTheme(),
    }

    async componentDidMount(){
      emitter.addListener('change', darkTheme => {
        this.setState({
          darkTheme,
        });
      });
      // Get the user's playlist
      const url = getApiUrl('api', '/me/playlists');
      const response = await axios.get(url);
      this.setState({
        playlist: response.data,
      });
    }

    eachPlaylist(playlists){
      const result = [];
      playlists.map(playlist => {
        return result.push(
          <GridListTile
            key={playlist.id}
            style={{
              width: '15em',
              height: '15em',
              position: 'relative',
            }}
          >
            <Button
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
              }}
            >
              <img 
                src={
                  (() => {
                    const url = getApiUrl('api', `/image/playlist/${playlist.id}`);
                    return googleCacheImage(url);
                  })()
                } 
                alt={playlist.id + ' cover art'} 
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            </Button>
            <GridListTileBar
              title={
                <Link to={`/playlist/${playlist.id}`}>
                  {playlist.title}
                </Link>
              }
            />
          </GridListTile>
        )
      });
      return result;
    }

    render(){
      if(this.state.playlist){
        return (
          <GridList>
            {
              this.eachPlaylist(this.state.playlist)
            }
          </GridList>
        )
      }else{
        return (
          <AbsoluteCenter>
            <CircularProgress />
            <Typography
              style={{
                color: this.state.darkTheme ? '#FFF' : '#161616',
              }}
            >Fetching your playlist</Typography>
          </AbsoluteCenter>
        )
      }
    }
}