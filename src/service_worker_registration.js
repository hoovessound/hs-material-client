if('serviceWorker' in navigator) {
    if (navigator.serviceWorker.controller) {
        console.log('[SW] active service worker found, no need to register')
    }else{
        (async () => {
            await navigator.serviceWorker.register('sw_Fv2cR.js', { scope: '/' });
            console.log('[SW] Service worker has been registered');
        })()
        .catch(error => {
            console.log(error);
        });
    }
}else{
    console.log('Your current browser do not support service worker');
}