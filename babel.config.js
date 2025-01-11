module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
      ['@babel/plugin-proposal-class-properties', { loose: true }], // Adjusted to use @babel/plugin-proposal-class-properties
      ['@babel/plugin-proposal-private-methods', { loose: true }], // Adjusted to use @babel/plugin-proposal-private-methods
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }], // Adjusted to use @babel/plugin-proposal-private-property-in-object
      'react-native-reanimated/plugin'
    ],
  };
};
