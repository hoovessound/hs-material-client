import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input from 'material-ui/Input';
import { emitter } from './NavBar';
import isDarkTheme from '../Utils/isDarkTheme';
import axios from 'axios';
import getApiUrl from '../Utils/getApiUrl';
import IconButton from 'material-ui/IconButton';
import InsertPhoto from 'material-ui-icons/InsertPhoto';
import Tooltip from 'material-ui/Tooltip';
import { notificationEmitter } from '../Component/Notification';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

class TextFieldMargins extends React.Component {

  state = {
    darkTheme: isDarkTheme(),
    value: '',
  }

  componentDidMount() {
    emitter.addListener('change', darkTheem => {
      this.setState({
        darkTheem,
      });
    });
  }

  onPaste(e){
    for (var i = 0 ; i < e.clipboardData.items.length ; i++) {
      let item = e.clipboardData.items[i];
      if(item.type.includes('image')) {
          const image = item.getAsFile();
          this.uploadPhoto(image);
      }
    }
  }

  async postComment(message) {
    const id = this.props.id;
    const url = getApiUrl('api', `/track/${id}/comment`);
    const response = await axios.post(url, {
      comment: message,
    });
    if (!response.data.error) {
      notificationEmitter.emit('push', {
        message: 'Thank you for your comment',
      });
      this.setState({
        value: '',
      });
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(response.data);
      }
    } else {
      notificationEmitter.emit('push', {
        message: 'Something when wrong :/',
      });
    }
  }

  async uploadPhoto(image) {
    notificationEmitter.emit('push', {
      message: 'Uploading',
    });
    const id = this.props.id;
    const url = getApiUrl('api', `/track/${id}/comment/upload`);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }
    const form = new FormData(this.refs.upload);
    if(image){
      form.append('image', image);
    }
    const response = await axios.post(url, form, config);
    if (!response.data.error) {
      this.refs.file.value = null;
      if (typeof this.props.onImageUPloadDone === 'function') {
        this.props.onImageUPloadDone(response.data);
      }
      // Append the url into the input field
      const value = this.state.value;
      this.setState({
        value: `${value} ${response.data.link}`,
      });
    } else {
      if(response.status !== 200){
        notificationEmitter.emit('push', {
          message: 'File did not upload',
        });
      }else{
        notificationEmitter.emit('push', {
          message: response.data.error,
        });
      }
    }
  }

  render() {

    const { classes } = this.props;

    return (
      <div>
        <Input
          placeholder="Your Comment"
          className={classes.textField}
          ref="inputField"
          onKeyDown={evt => {
            const charCode = evt.which || evt.charCode || evt.keyCode || 0;
            if (charCode === 13) {
              // ENTER
              const text = evt.target.value.trim();
              if (text.length >= 1) {
                // Valid
                this.postComment(text);
                evt.target.value = null;
                evt.target.blur();
              }
            }
          }}
          onChange={e => {
            this.setState({
              value: e.target.value,
            });
          }}
          value={this.state.value}
          onPaste={e => this.onPaste(e)}
        />
        <Tooltip title='Image Upload'>
          <IconButton
            onClick={e => {
              this.refs.file.click();
            }}
          >
            <InsertPhoto></InsertPhoto>
            <form ref="upload"
              style={{
                display: 'none'
              }}
            >
              <input type="file" accept="image/*" name="image" ref="file" onChange={e => this.uploadPhoto(e)} />
            </form>
          </IconButton>
        </Tooltip>
      </div>
    );
  }

};

TextFieldMargins.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextFieldMargins);
