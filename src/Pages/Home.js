import React from 'react';
import TrackContainer from '../Component/TrackContainer';
import GridList from 'material-ui/GridList';
import getApiUrl from '../Utils/getApiUrl';
import axios from 'axios';
import {CircularProgress} from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import isDarkTheme from '../Utils/isDarkTheme';
import {emitter} from '../Component/NavBar';
import AbsoluteCenter from '../Component/AbsoluteCenter';
import { playerEmitter } from '../Component/Player';

import InfiniteScroll from 'react-infinite-scroller';
import Grow from 'material-ui/transitions/Grow';

import '../SCSS/HomePage.scss';

let fetchingTrack = false;

export default class HomePage extends React.Component {

    state = {
        tracks: [],
        darkTheme: isDarkTheme(),
        fetchIngTracks: true,
        offset: 0,
        hasMore: true,
    }

    async componentDidMount() {
        let offset = 0;
        emitter.addListener('change', darkTheme => {
            this.setState({
                darkTheme,
            });
        });
        if(this.props.match.params.offset){
            offset = parseInt(this.props.match.params.offset, 10);
        }
        const url = getApiUrl('api', `/tracks?offset=${offset}`);
        const response = await axios.get(url);
        if(!response.data.error){
            playerEmitter.emit('localplaylist.add', response.data);
            this.setState({
                tracks: response.data,
                offset: (offset + 10),
            });
        }
    }

    eachTrack(tracks) {
        const array = [];
        tracks.map((track, index) => {
            return array.push(
                <TrackContainer track={track} key={track.id}/>
            )
        });
        return array;
    }

    async fetchTracks(isInit) {
        if (!fetchingTrack) {
            fetchingTrack = true;
            const url = getApiUrl('api', `/tracks?offset=${this.state.offset}`);
            const response = await axios.get(url);
            const tracks = this.state.tracks;
            if (!response.data.error) {

                response.data.map(track => {
                    playerEmitter.emit('localplaylist.add', response.data);
                    return tracks.push(track);
                });
                this.setState({
                    tracks,
                });

                if(response.data.length >= 1){
                    this.props.history.push(`/${this.state.offset}`)
                    this.setState({
                        offset: (this.state.offset + response.data.length),
                    });
                }else{
                    this.setState({
                        hasMore: false,
                    });
                }
                fetchingTrack = false;
            }
        }
    }

    render() {

        if (this.state.tracks.length <= 0) {
            return (
                <AbsoluteCenter>
                    <CircularProgress/>
                    <Typography
                        style={{
                            color: this.state.darkTheme ? '#FFF' : '#161616',
                        }}
                    >Fetching tracks</Typography>
                </AbsoluteCenter>
            )
        } else {

            return (
                <div id="tracks">
                    <Grow in={true}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={() => this.fetchTracks()}
                            hasMore={this.state.hasMore}
                            threshold={0}
                            loader=
                                {
                                    <div
                                        key={'trackLoader'}
                                        style={{
                                            textAlign: 'center',
                                        }}
                                    >
                                        <CircularProgress/>
                                        <Typography
                                            style={{
                                                color: this.state.darkTheme ? '#FFF' : '#161616',
                                            }}
                                        >
                                            Loading more tracks
                                        </Typography>
                                    </div>
                                }
                        >
                            <GridList>
                                {
                                    this.eachTrack(this.state.tracks)
                                }
                            </GridList>
                        </InfiniteScroll>
                    </Grow>
                </div>
            );
        }
    }
}