import React from 'react';
import getApiUrl from '../Utils/getApiUrl';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import cookies from 'react-cookies';

export default class Login extends React.Component {

  componentDidMount(){
    if(cookies.load('jwt_token')) {
      window.location = '/';
    }else{
      window.location = getApiUrl('id', `/login?service=hs_service_login&redirect=${window.location.href}`);
    }
  }

  render(){
    return (
      <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <CircularProgress />
          <Typography>Please wait</Typography>
        </div>
    )
  }
}