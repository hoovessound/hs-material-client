import cookies from 'react-cookies';
export default (subdomain = 'api', path = '/', needAuth = true) => {
    let tail = "";
    let isTls = false;

    if (!subdomain.endsWith('.')) {
        subdomain += '.';
    }

    if (subdomain === '$NA.' || subdomain === null) {
        subdomain = "";
    }

    if(needAuth){
      const token = cookies.load('jwt_token');
      if(path.includes('?')){
        tail += `&jwt=${token}&bypass=true`;
      }else{
        tail += `?jwt=${token}&bypass=true`;
      }
    }

    if(window.location.href.startsWith('https://')){
      // TLS
      isTls = true;
    }

    if(isTls){
      return (`https://${subdomain}hoovessound.ml${path}${tail}`);
    }

    if(process.env.NODE_ENV === 'production'){
      return (`https://${subdomain}hoovessound.ml${path}${tail}`);
    }else{
      return (`http://${subdomain}hoovessound.me:3000${path}${tail}`);
    }


}