import React from 'react';
import Menu, { MenuItem } from 'material-ui/Menu';
import { notificationEmitter } from '../Component/Notification';

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
      message: `You have 🔥 a report on track ${title}`,
    });
    this.handleClose();
  }

  favorite(){
    notificationEmitter.emit('push', {
      message: `Thank you for the ️❤️`,
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
          <MenuItem onClick={this.favorite.bind(this)}><span role="img" aria-label="Favorite">❤️</span> Favorite</MenuItem>
          <MenuItem onClick={this.fireReport.bind(this)}><span role="img" aria-label="Report">✍️</span> Report</MenuItem>
          <MenuItem onClick={this.handleClose}><span role="img" aria-label="Dislike">👎</span> This track</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default SimpleMenu;