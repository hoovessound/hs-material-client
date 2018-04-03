import React from 'react';
import Menu, { MenuItem } from 'material-ui/Menu';
import { notificationEmitter } from '../Component/Notification';
import Emojify from 'react-emojione';

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

  fireReport(){
    const title = this.props.track.title;
    notificationEmitter.emit('push', {
      message: `You have :fire: a report on track ${title}`,
    });
    this.handleClose();
  }

  favorite(){
    notificationEmitter.emit('push', {
      message: `Thank you for the :heart:`,
    });
    this.handleClose();
  }

  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.favorite.bind(this)}>
            <Emojify style={{height: 17, width: 17}}>
              :heart:
            </Emojify>
            Favorite
          </MenuItem>

          <MenuItem onClick={this.fireReport.bind(this)}>
            <Emojify style={{height: 17, width: 17}}>
              :writing_hand:
            </Emojify>
            Report
          </MenuItem>

          <MenuItem onClick={this.fireReport.bind(this)}>
            <Emojify style={{height: 17, width: 17}}>
              :thumbsdown:
            </Emojify>
            This track
          </MenuItem>

        </Menu>
      </div>
    );
  }
}

export default SimpleMenu;