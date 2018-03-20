export default function googleCacheImage(url, size=null, cache=604800){
  return 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy'
  + '?container=focus'
  + '&resize_w=' + size
  + '&resize_h=' + size
  + '&refresh=' + cache // default: 1 Week
  + '&url=' + url
  + '&no_expand=0'
  ;
}