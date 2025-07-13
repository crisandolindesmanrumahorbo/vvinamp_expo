// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add TypeScript extensions
config.resolver.sourceExts.push("ts", "tsx");

module.exports = withNativeWind(config, { input: "./global.css" });
