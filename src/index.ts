import { PluginScrollShadow as _PluginScrollShadow } from './components/shadowPlugin/index';

/* tslint:disable:variable-name */
export namespace Components {
    export const PluginScrollShadow = _PluginScrollShadow;
}

(<any>window).Components = {
    PluginScrollShadow : Components.PluginScrollShadow
};
