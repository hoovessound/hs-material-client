import React from 'react';
import HomePage from './Pages/Home'
import Login from './Pages/Login';
import NavBar from './Component/NavBar';
import Player from './Component/Player';
import Page404 from './Pages/Error/404';
import ProfilePage from './Pages/User';
import SettingsPage from './Pages/Setting';
import LoginPage from './Pages/Login';
import TrackPage from './Pages/Track';
import MyPlaylist from './Pages/My/MyPlaylist';
import AboutPrimePage from './Pages/AboutPrime';
import UploadPage from './Pages/Upload';


import {
    BrowserRouter,
    Route,
    Switch,
} from 'react-router-dom';

// Some default settings

// Sync = true
if (typeof localStorage.getItem('hs_sync') === 'object') {
    localStorage.setItem('hs_sync', 'true');
}

// Fade out = true
if (typeof localStorage.getItem('hs_fadeout') === 'object') {
    localStorage.setItem('hs_fadeout', 'true');
}

if (localStorage.getItem('hs_access_token')) {
    localStorage.removeItem('hs_access_token');
    window.location = '/login';
}
;

export default class Routers extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <div
                    style={{
                        marginBottom: '5.5em',
                        marginTop: '4.5em',
                    }}
                >
                    <NavBar/>

                    <div
                        style={{
                            margin: 'auto',
                            width: '90vw',
                            position: 'relative'
                        }}
                    >
                        <Switch>

                            <Route exact path="/login" component={LoginPage}/>
                            <Route exact path="/setting" component={SettingsPage}/>
                            <Route exact path="/my/playlist" component={MyPlaylist}/>
                            <Route exact path="/prime/about" component={AboutPrimePage}/>
                            <Route exact path="/upload" component={UploadPage}/>
                            <Route path="/auth/callback" component={Login}/>
                            
                            <Route exact path="/@:username" component={ProfilePage}/>
                            <Route exact path="/track/:id" component={TrackPage}/>
                            <Route exact path="/:offset?" component={HomePage}/>
                            <Route component={Page404}/>
                        </Switch>
                    </div>
                    <Player/>
                </div>
            </BrowserRouter>
        )
    }
}