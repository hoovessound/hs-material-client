import cookie from 'react-cookies';
export default function isDarkTheme(){
  return cookie.load('hs_dark_theme') === 'true' ? true : false;
}