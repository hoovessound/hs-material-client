import React from 'react';
import axios from 'axios';
import GridList from 'material-ui/GridList';
import TrackContainer from '../Component/TrackContainer';
import getApiUrl from '../Utils/getApiUrl';
import AbsoluteCenter from '../Component/AbsoluteCenter';
import {CircularProgress} from 'material-ui/Progress';

export default class Tag extends React.Component {
    state = {
        tracks: [],
    }

    async componentDidMount(){
        // Fetching tracks from this playlist
        const url = getApiUrl('api', `/tag/${this.props.match.params.tag}`);
        const response = await axios.get(url);
        if(!response.data.error){
            this.setState({
                tracks: response.data,
            });
        }
    }

    eachTrack(tracks) {
        const array = [];
        tracks.map((track, index) => {
            console.log(track.id);
            return array.push(
                <TrackContainer track={track} key={track.id}/>
            )
        });
        return array;
    }

    render(){
        if (this.state.tracks.length <= 0) {
            return (
                <AbsoluteCenter>
                    <CircularProgress/>
                </AbsoluteCenter>
            )
        }else{
            return (
                <GridList>
                    {
                        this.eachTrack(this.state.tracks)
                    }
                </GridList>
            )
        }
    }
}