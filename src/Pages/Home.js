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
import Player from '../Component/Player';
import InfiniteScroll from 'react-infinite-scroller';
import Grow from 'material-ui/transitions/Grow';

import '../SCSS/HomePage.scss';

let fetchingTrack = false;
const player = new Player();

export default class HomePage extends React.Component {

    state = {
        tracks: [],
        darkTheme: isDarkTheme(),
        fetchIngTracks: true,
        offset: 0,
        hasMore: true,
    }

    async componentDidMount() {
        emitter.addListener('change', darkTheme => {
            this.setState({
                darkTheme,
            });
        });

        function init(offset, self) {
            self.setState({
                offset,
            }, () => {
                self.fetchTracks();
            });
        }

        if (this.props.match.params.offset) {
            const offset = parseInt(this.props.match.params.offset, 10);
            this.setState({
                offset,
            });
            init(offset, this);
        } else {
            init(0, this);
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

    async fetchTracks() {
        if (!fetchingTrack) {
            fetchingTrack = true;
            const url = getApiUrl('api', `/tracks?offset=${this.state.offset}`);
            const response = await axios.get(url);
            const tracks = this.state.tracks;
            if (!response.data.error) {

                const length = response.data.length;

                if(length >= 1){

                    if(length === 10){
                        const offset = (this.state.offset + length);
                        this.setState({
                            offset,
                        }, () => {
                            this.props.history.push(`/${offset}`);
                        });
                    }else{
                        this.setState({
                            hasMore: false,
                        });
                    }

                    response.data.map(track => {
                        return tracks.push(track);
                    });

                    this.setState({
                        tracks,
                    });

                    player.emitter.emit('localplaylist.add', response.data);

                    fetchingTrack = false;

                }else{
                    this.setState({
                        hasMore: false,
                    });
                }

                // if (response.data.length >= 10) {
                //
                //     if(response.data.length >= 10){
                //         this.setState({
                //             offset: (this.state.offset + response.data.length),
                //         });
                //
                //         // Update the URL bar
                //         if (this.state.offset !== 0) {
                //             this.props.history.push(`/${this.state.offset}`);
                //         }
                //     }
                //
                //     response.data.map(track => {
                //         return tracks.push(track);
                //     });
                //     fetchingTrack = false;
                //     this.setState({
                //         tracks,
                //         fetchingTrack,
                //     });
                //     player.emitter.emit('localplaylist.add', response.data);
                // } else {
                //     this.setState({
                //         hasMore: false,
                //     });
                // }
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

                            loader=
                                {
                                    <div
                                        style={{
                                            textAlign: 'center',
                                        }}
                                    >
                                        <CircularProgress/>
                                        <Typography>Loading more tracks</Typography>
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