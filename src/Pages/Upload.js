import React from 'react';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import AbsoluteCenter from '../Component/AbsoluteCenter';
import { LinearProgress } from 'material-ui/Progress';
import Input from 'material-ui/Input';
import axios from 'axios';
import getApiUrl from '../Utils/getApiUrl';
import googleCacheImage from '../Utils/googleCacheImage';
import { Redirect } from 'react-router-dom';

import ArrowBack from 'material-ui-icons/ArrowBack';
import MusicNote from 'material-ui-icons/MusicNote';
import InsertPhoto from 'material-ui-icons/InsertPhoto';
import CheckCircle from 'material-ui-icons/CheckCircle';

import Fade from 'material-ui/transitions/Fade';

import '../SCSS/Upload.scss';


export default class Upload extends React.Component {

    state = {
        /*
            local: upload from the user's computer
            youtube: import the track from YouTube
        */
        source: 'lol',
        selectionOpen: true,
        uploadFade: true,
        gotPhoto: false,
        progressBarValue: 0,
        youtubeButtonDisable: false,
        youtubeButtonText: 'Upload',
    }

    handelMenuClick(option){
        switch(option){
            case 'local': {
                // Upload from user's computer
                this.setState({
                    source: 'local',
                }, () => {
                    this.handleClose();
                });
                break;
            }

            case 'youtube': {
                // Import from YouTube
                this.setState({
                    source: 'youtube',
                }, () => {
                    this.handleClose();
                });

                break;
            }
            default: {
                return false;
            }
        }
    }

    handleClose(){
        if(this.state.source !== 'lol'){
            this.setState({
                selectionOpen: false,
            });
        }
    }

    handleOpen(){
        this.setState({
            selectionOpen: true,
        });
    }

    coverArtOnChange(e){
        this.setState({
            gotPhoto: true,
        })
    }

    youtubeParser(url){
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#]*).*/;
        const match = url.match(regExp);
        this.setState({
            youtubeUrl: url,
        });
        return (match&&match[7].length===11)? match[7] : false;
    }

    async upload(){
        const form = new FormData(this.refs.uploadForm);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },

            // Functions
            onUploadProgress:(progressEvt) => {
                const complete = progressEvt.loaded / progressEvt.total;
                const percentComplete = complete * 100;
                this.setState({
                    processBarValue: percentComplete,
                })
            }
        };
        const response = await axios.post(getApiUrl('api', `/upload`), form, config);
        // Redirect the user to the track page
        this.setState({
            redirect: `/track/${response.data.id}`,
        });
    }

    async youtubeImport(){
        this.setState({
            youtubeButtonDisable: true,
            youtubeButtonText: 'Importing',
        });
        const form = new FormData();
        form.append('youtube-id', this.state.youtubeUrl);
        form.append('youtube-import', 'on');
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },

            // Functions
            onUploadProgress:(progressEvt) => {
                const complete = progressEvt.loaded / progressEvt.total;
                const percentComplete = complete * 100;
                this.setState({
                    processBarValue: percentComplete,
                })
            }
        };
        const response = await axios.post(getApiUrl('api', `/upload`), form, config);
        // Redirect the user to the track page
        this.setState({
            redirect: `/track/${response.data.id}`,
        });
    }

    render(){
        return (
            <div id="upload">

                <Dialog open={this.state.selectionOpen} onClose={() => this.handleClose()} aria-labelledby="simple-dialog-title">
                    <DialogTitle id="simple-dialog-title">Upload From</DialogTitle>
                    <List>
                        <ListItem button onClick={() => this.handelMenuClick('local')}>
                            <ListItemText>Local Computer</ListItemText>
                        </ListItem>

                        <ListItem button onClick={() => this.handelMenuClick('youtube')}>
                            <ListItemText>YouTube</ListItemText>
                        </ListItem>
                    </List>
                </Dialog>

                <LinearProgress color="secondary" variant="determinate" value={this.state.progressBarValue} ref={'processBar'} />

                {
                    (() => {
                        if(this.state.source !== 'lol'){
                            return (
                                <Tooltip title={'Reselect sources'}>
                                    <Button variant="fab" color="secondary"
                                        style={{
                                            marginBottom: '0.5em',
                                        }}
                                        onClick={() => this.handleOpen()}
                                    >
                                        <ArrowBack />
                                    </Button>
                                </Tooltip>
                            )
                        }
                    })()
                }

                {
                    (() => {
                        if(this.state.source === 'local'){

                            return (
                                <AbsoluteCenter>

                                    {
                                        (() => {
                                            if(this.state.uploadFade){
                                                const source = googleCacheImage('http://www.stickpng.com/assets/images/580b57fcd9996e24bc43c450.png', null, 3.154e+7);
                                                return (
                                                    <div id={'arrows'}>
                                                        <Typography>Upload An Track</Typography>
                                                        <img 
                                                            id={'arrow1'} 
                                                            alt="arrow"
                                                            src={source}
                                                        />
                                                        <img 
                                                            id={'arrow2'} 
                                                            alt="arrow"
                                                            src={source}
                                                        />
                                                        <img 
                                                            id={'arrow3'} 
                                                            alt="arrow"
                                                            src={source}
                                                        />
                                                    </div>
                                                )
                                            }
                                        })()
                                    }

                                    <form autocomplete={'off'} ref={'uploadForm'}>
                                        <Fade in={this.state.uploadFade}>
                                            <Button
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '5em 10em',
                                                }}
                                                containerElement='label'
                                                label='Upload an audio track from your local computer'>
                                                <input type="file"
                                                       style={{
                                                           position: 'absolute',
                                                           width: '100%',
                                                           height: '100%',
                                                           top: 0,
                                                           left: 0,
                                                           opacity: 0,
                                                        }}
                                                       onChange={() => {
                                                           this.setState({
                                                               uploadFade: false,
                                                           });
                                                       }}
                                                       name={'audio'}
                                                       accept={'audio/mp3,audio/mpeg,audio/ogg'}
                                                />
                                                <MusicNote />
                                            </Button>
                                        </Fade>

                                        <Fade in={!this.state.uploadFade}
                                            style={{
                                                display: 'block',
                                            }}
                                        >
                                            <div>
                                                <Input
                                                    placeholder={'Track Title'}
                                                    name={'title'}
                                                />
                                                <br />
                                                <Input
                                                    placeholder={'Description'}
                                                    name={'description'}
                                                    multiline={true}
                                                />
                                                <br />
                                                <Button
                                                    style={{
                                                        cursor: 'pointer',
                                                        padding: '5em 10em',
                                                        backgroundSize: 'cover',
                                                    }}
                                                    containerElement='label'
                                                    label='Upload a cover art for your track'>
                                                    <input type="file"
                                                           style={{
                                                               position: 'absolute',
                                                               width: '100%',
                                                               height: '100%',
                                                               top: 0,
                                                               left: 0,
                                                               opacity: 0,
                                                           }}
                                                           name={'image'}
                                                           onChange={e => this.coverArtOnChange(e)}
                                                           accept={'image/*'}
                                                    />
                                                    {
                                                        (() => {
                                                            if(!this.state.gotPhoto){
                                                                return (
                                                                    <InsertPhoto />
                                                                )
                                                            } else{
                                                                return (
                                                                    <CheckCircle style={{color: 'green'}} />
                                                                )
                                                            }
                                                        })()
                                                    }
                                                </Button>
                                                <br />
                                                <Button variant="raised" color="primary" onClick={e => this.upload(e)}>Upload</Button>
                                            </div>

                                        </Fade>
                                    </form>
                                </AbsoluteCenter>
                            )
                        }
                    })()
                }

                {
                    (() => {
                        if(this.state.source === 'youtube'){
                            return (
                                <div id="youtube">
                                   <AbsoluteCenter>
                                       <form id="youtubeImport">
                                           <Input
                                               placeholder={'YouTube URL'}
                                               onInput={e => {
                                                   if(this.youtubeParser(e.target.value)){
                                                       this.setState({
                                                           isYouTubeUrl: true,
                                                       });
                                                   }else{
                                                       this.setState({
                                                           isYouTubeUrl: false,
                                                       });
                                                   }
                                               }}
                                           />
                                           <br />
                                           {
                                               (() => {
                                                   if(this.state.isYouTubeUrl){
                                                       return (
                                                           <Button variant="raised" color="primary" onClick={e => this.youtubeImport(e)} disable={this.state.youtubeButtonDisable}>{this.state.youtubeButtonText}</Button>
                                                       )
                                                   }else{
                                                       return(
                                                           <div>
                                                               <Typography>Not a valid YouTube URL</Typography>
                                                               <br />
                                                               <Button variant="raised" color="primary" disabled={true}>{this.state.youtubeButtonText}</Button>
                                                           </div>
                                                       )
                                                   }
                                               })()
                                           }
                                       </form>
                                   </AbsoluteCenter>
                                </div>
                            )
                        }
                    })()
                }

                {
                    (() => {
                        if(this.state.redirect){
                            return (
                                <Redirect to={this.state.redirect} />
                            )
                        }else{
                            return <span></span>;
                        }
                    })()
                }
            </div>
        )
    }
}