// Well, I just create our own Redux store :/
import { EventEmitter } from 'fbemitter';
export const emitter = new EventEmitter();
let registry = {};
export function set(name, object){
    emitter.emit('set', {name, object});
    registry[name] = object;
}
export function get(name){
    emitter.emit('get', {
        name,
    });
    return registry[name];
}