import React from 'react';
import Avatar from 'material-ui/Avatar';
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import isDarkTheme from '../Utils/isDarkTheme';
import getApiUrl from '../Utils/getApiUrl';
import googleCacheImage from '../Utils/googleCacheImage';
import { emitter } from '../Component/NavBar';
import TrackContainer from '../Component/TrackContainer';
import axios from 'axios';
import { CircularProgress } from 'material-ui/Progress';
import GridList from 'material-ui/GridList';

export default class User extends React.Component {

  state = {
    username: '',
    darkTheme: isDarkTheme(),
  }

  async componentDidMount(){

    emitter.addListener('change', darkTheme => {
      this.setState({
        darkTheme,
      });
    });

    const username = this.props.match.params.username;
    this.setState({
      username,
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

  render(){

    return (
      <div>
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
                const url = `https://api.hoovessound.ml/image/avatar/${this.state.username}?width=50`;
                return googleCacheImage(url, 50)
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
          >{this.state.username}</Typography>
        </div>
        
        <div id="status"
          style={{
            marginTop: '0.5em',
          }}
        >
          <Button variant="raised" color="primary" >follow</Button>
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