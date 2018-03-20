import io from 'socket.io-client';
import getApiUrl from './getApiUrl';
import cookies from 'react-cookies';

let token;
let id;
let _socket;

const socket = io(getApiUrl('$NA', '/', false));
_socket = socket;
socket.on('connect', () => {
    const jwtToken = cookies.load('jwt_token');
    console.log('HS WS: establish connection');
    if(jwtToken){
        socket.emit('auth.register', {
            jwt: jwtToken,
        });
        console.log('HS WS: registering a new authentication key');
        socket.on('auth.new', payload => {
            token = payload.token;
            id = payload.id;
        });
        console.log('HS WS: received authentication key');
    }else{
        console.log('HS WS: Ready for anonymous authentication');
    }
    console.log('HS WS: Read for WS communication');
    console.log(`HS WS: Session ID: ${socket.id}`);
});

export function getToken(){
    return token;
}

export function getId(){
    return id;
}

export function getSocket(){
    return _socket;
}