import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import red from 'material-ui/colors/red';
import getApiUrl from '../Utils/getApiUrl';
import moment from 'moment';
import Linkify from 'react-linkify';
import renderHTML from 'react-render-html';
import { playerEmitter } from './Player';
import { Link } from 'react-router-dom';
import Dialog, {
    DialogActions,
    DialogContent,
} from 'material-ui/Dialog';
import Image from 'material-ui-image';
import Menu, { MenuItem } from 'material-ui/Menu';
import { notificationEmitter } from './Notification';
import Chip from 'material-ui/Chip';
import axios from 'axios';
import isLogin from '../Utils/isLogin';

import FavoriteIcon from 'material-ui-icons/Favorite';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import PageViewIcon from 'material-ui-icons/Pageview';

import Slide from 'material-ui/transitions/Slide';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const styles = theme => ({
    card: {
        maxWidth: '80vw',
    },
    media: {
        height: 200,
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
});

class SimpleMenu extends React.Component {
    state = {
      anchorEl: null,
    };
  
    handleClick = event => {
      this.setState({ anchorEl: event.currentTarget });
    };
  
    handleClose = () => {
      this.setState({ anchorEl: null });
    };
  
    render() {
      const { anchorEl } = this.state;

      const style = {
          outline: 'none',
      }

      return (
        <div>
          <Button
            aria-owns={anchorEl ? 'simple-menu' : null}
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            Download
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <a style={style} href={getApiUrl('api', `/image/coverart/${this.props.id}?width=300`, false)} target='_blank'>
                <MenuItem onClick={this.handleClose}>300x300(WebP)</MenuItem>
            </a>

            <a style={style} href={getApiUrl('api', `/image/coverart/${this.props.id}?width=500`, false)} target='_blank'>
                <MenuItem onClick={this.handleClose}>500x500(WebP)</MenuItem>
            </a>

            <a style={style} href={getApiUrl('api', `/image/coverart/${this.props.id}?width=600`, false)} target='_blank'>
                <MenuItem onClick={this.handleClose}>600x600(WebP)</MenuItem>
            </a>

            <a style={style} href={getApiUrl('api', `/image/coverart/${this.props.id}?webp=false`, false)} target='_blank'>
                <MenuItem onClick={this.handleClose}>Original</MenuItem>
            </a>
          </Menu>
        </div>
      );
    }
  }

class RecipeReviewCard extends React.Component {
    state = {
        expanded: false,
        viewImage: false,
        loadBigImage: false,
        isFavorite: false,
    };

    handleExpandClick = () => {
        this.setState({ expanded: !this.state.expanded });
    };

    async componentDidMount() {
        const { track } = this.props;
        // Injecting some default tags
        track.tags.push(
            `artist:${track.author.username}`,
        );
        const url = getApiUrl('api', `/track/${track.id}/is_favorite`);
        const response = await axios.get(url);
        if(!response.data.error){
            this.setState({
                isFavorite: response.data.is_favorite,
            });
        }
    }

    async favoriteThisTrack() {
        this.setState({
            isFavorite: !this.state.isFavorite,
        });
        const url = getApiUrl('api', `/track/${this.props.track.id}/favorite`);
        const response = await axios.post(url);
        if(response.data.error){
            this.setState({
                isFavorite: !this.state.isFavorite,
            });
            notificationEmitter.emit('push', {
                message: 'Oh crap, something when wrong, plz try that again',
                button: ':face_palm:',
            });
        }
    }

    render() {
        const { classes, track } = this.props;

        return (
            <div>

                <Dialog
                    open={this.state.viewImage}
                    transition={Transition}
                    keepMounted
                    onClose={() => this.setState({viewImage: false})}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    fullScreen={false}
                    fullWidth
                    maxWidth={'sm'}
                    onBackdropClick={() => this.setState({viewImage: false})}
                >
                    <DialogContent>
                        {
                            (() => {
                                if(this.state.loadBigImage){
                                    return (
                                        <Image 
                                            src={getApiUrl('api', `/image/coverart/${track.id}?width=600`, false)}
                                            float={0.1}
                                        />
                                    )
                                }
                            })()
                        }
                    </DialogContent>

                    <DialogActions>
                    <SimpleMenu id={track.id} />
                    <Button onClick={() => this.setState({viewImage: false})} color="primary">
                        Close
                    </Button>
                </DialogActions>
                </Dialog>

                <Card className={classes.card}>
                    <CardHeader
                        avatar={
                            <Link to={`/@${track.author.username}`}>
                                <Avatar aria-label={track.author.fullname} className={classes.avatar} src={getApiUrl('api', `/image/avatar/${track.author.username}?width=50`, false)} />
                            </Link>
                        }
                        title={
                            renderHTML(
                                track.title
                            )
                        }
                        subheader={moment(track.uploadDate).fromNow()}
                    />

                    <CardMedia
                        className={classes.media}
                        image={getApiUrl('api', `/image/coverart/${track.id}?width=500`, false)}
                        title={`${track.title} cover art`}
                    />

                    <CardActions className={classes.actions} disableActionSpacing>
                        

                        {
                            (() => {
                                if(isLogin()){
                                    return (
                                        <IconButton aria-label="Add to favorites"
                                            onClick={() => this.favoriteThisTrack()}
                                        >
                                            {
                                                (() => {
                                                    if(this.state.isFavorite){
                                                        return (
                                                            <FavoriteIcon style={{
                                                                color: 'red',
                                                            }} />
                                                        )
                                                    }else{
                                                        return (
                                                            <FavoriteIcon />
                                                        )
                                                    }
                                                })()
                                            }
                                        </IconButton>
                                    )
                                }
                            })()
                        }

                        <IconButton aria-label="Play/pause" onClick={() => playerEmitter.emit('play', track)}>
                            <PlayArrowIcon />
                        </IconButton>
                        <IconButton aria-label="View cover art" onClick={() => {
                            this.setState({ viewImage: true });
                            if(!this.state.loadBigImage){
                                this.setState({
                                    loadBigImage: true,
                                });
                            }
                        }}>
                            <PageViewIcon />
                        </IconButton>
                        
                        <IconButton
                            className={classnames(classes.expand, {
                                [classes.expandOpen]: this.state.expanded,
                            })}
                            onClick={this.handleExpandClick}
                            aria-expanded={this.state.expanded}
                            aria-label="Show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>

                    </CardActions>

                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        <CardContent>

                            {
                                // Showing the track's tags
                                (() => {
                                    const tags = [];
                                    track.tags.map(tag => {
                                        if(tag === `artist:${track.author.username}`){
                                            return tags.push(
                                                <Link
                                                    to={`/@${track.author.username}`}
                                                >
                                                    <Chip
                                                        label={tag}
                                                    />
                                                </Link>
                                            );
                                        }else{
                                            return tags.push(
                                                <Link
                                                    to={`/tag/${tag}`}
                                                >
                                                    <Chip
                                                        label={tag}
                                                    />
                                                </Link>
                                            );
                                        }
                                    });
                                    return tags;
                                })()
                            }

                            {
                                // Showing the track description if is not null and the length is bigger then 1 line
                                (() => {
                                    if(track.description !== null){
                                        if(track.description.length >= 1){
                                            return (
                                                <Typography paragraph
                                                    onClick={e => {
                                                        if(e.target.tagName === 'A' || e.target.tagName === 'a'){
                                                            e.preventDefault();
                                                            window.open(
                                                                getApiUrl('redirect', `/?redirect=${e.target.href}&target=track_description`, false),
                                                                '_blank'
                                                            )
                                                        }
                                                    }}
                                                >
                                                    <Linkify
                                                        properties={
                                                            {
                                                                target: '_blank',
                                                            }
                                                        }
                                                    >
                                                        {
                                                            renderHTML(
                                                                track.description.split('\n').join('<BR />')
                                                            )
                                                        }
                                                    </Linkify>
                                                    
                                                </Typography>
                                            )
                                        }
                                    }
                                })()
                            }
                        </CardContent>
                    </Collapse>
                </Card>
            </div>
        );
    }
}

RecipeReviewCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecipeReviewCard);