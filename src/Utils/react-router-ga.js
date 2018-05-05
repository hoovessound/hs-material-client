/* eslint-disable */

/*
Thanks to @fknussel
GitHub: https://github.com/fknussel/react-router-ga
*/

import * as React from 'react';
import { withRouter } from 'react-router-dom';
import type { Location, RouterHistory } from 'react-router-dom';
import axios from 'axios';
import getApiUrl from './getApiUrl';
import cookies from 'react-cookies';

type Props = {
  id: string, // Google Analytics Tracking ID
  debug: boolean,
  children?: React.Node,
  location: Location,
  history: RouterHistory
};

class ReactRouterGA extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.sendPageView = this.sendPageView.bind(this);
    this.initialize = this.initialize.bind(this);

    this.initialize(props.id);
  }

  componentDidMount() {
    this.sendPageView(this.props.location);
    this.props.history.listen(this.sendPageView);
  }

  initialize() {
    if (!this.props.id) {
      console.error('[react-router-ga] Tracking ID is required.');
      return;
    }

    // Load Google Analytics
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    if(cookies.load('jwt_token')){
        const url = getApiUrl('api', '/me');
        (async () => {
            const response = await axios.get(url);
            // Initialize Google Analytics
            window.ga('create', this.props.id, {
                storage: 'none',
                clientId: response.data.id,
            });
            window.ga('send', 'pageview');
        })()
    }else{
        window.ga('create', this.props.id, 'auto');
        window.ga('send', 'pageview');
    }
  }

  sendPageView(location: Location) {
    // Do nothing if GA was not initialized due to a missing tracking ID.
    if (!window.ga) {
      return;
    }

    // Sets the page value on the tracker.
    window.ga('set', 'page', location.pathname);

    // Sending the pageview no longer requires passing the page
    // value since it's now stored on the tracker object.
    window.ga('send', 'pageview');

    if (this.props.debug) {
      console.info(`[react-router-ga] Page view: ${location.pathname}`);
    }
  }

  render() {
    return this.props.children;
  }
}

ReactRouterGA.defaultProps = {
  debug: false
};

export default withRouter(ReactRouterGA);