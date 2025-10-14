
// metro.config.js (RN 0.73 template)
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, {
  resolver: {
    blacklistRE: /(.*\/__fixtures__\/.*|node_modules[\/\\]react[\/\\]dist[\/\\].*|website\/node_modules\/.*|heapCapture\/bundle\.js|.*\/__tests__\/.*)|(android\/.*|ios\/build\/.*|ios\/Pods\/.*|ios\/DerivedData\/.*)/,
  },
  server: {
    port: 8081,
  },
  maxWorkers: 1,
  watchFolders: [],
});