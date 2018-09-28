import browserEnv from 'browser-env';
import jQueryV1 from 'jquery-v1';
import jQueryV2 from 'jquery-v2';
import jQueryV3 from 'jquery-v3';
import annex from '../../src/jquery.annex.js';

browserEnv();

global.$v1 = annex(jQueryV1(window));
global.$v2 = annex(jQueryV2(window));
global.$v3 = annex(jQueryV3(window));
global.$versions = [$v1, $v2, $v3];
global.jQuery = global.$ = window.jQuery = window.$ =  undefined;
global.__AVA_ENV__ = window.__AVA_ENV__ = true;
