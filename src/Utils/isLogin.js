import cookies from 'react-cookies';

export default function isLogin(){
    if(cookies.load('jwt_token')){
        return true;
    }else{
        return false;
    }
}