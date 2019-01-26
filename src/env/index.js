import merge from 'deepmerge';
import getValue from 'get-value';

import defaultEnv from './default';
import staticEnv from 'env-static';

const dynamicEnv = window.ENV || {};
const appConfig = merge.all([defaultEnv, staticEnv, dynamicEnv]);

export default {
  get: (key) => getValue(appConfig, key),
};
