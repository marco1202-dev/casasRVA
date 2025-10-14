const Metro = require('metro');
const path = require('path');

async function createBundle() {
  try {
    const config = await Metro.loadConfig({
      config: path.resolve(__dirname, 'metro.config.js'),
      maxWorkers: 1,
      resetCache: true,
    });

    // Override watcher to disable file watching
    config.watcher = {
      healthCheck: { enabled: false },
      watchman: { deferStates: [] },
    };
    config.watch = false;

    const result = await Metro.runBuild(config, {
      dev: false,
      entry: './index.js',
      out: path.resolve(__dirname, 'ios/main.jsbundle'),
      platform: 'ios',
      minify: false,
      sourceMap: false,
    });

    console.log('Bundle created successfully!');
  } catch (error) {
    console.error('Error creating bundle:', error);
    process.exit(1);
  }
}

createBundle();

