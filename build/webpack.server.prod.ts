import { NormalModuleReplacementPlugin, NoEmitOnErrorsPlugin } from 'webpack';
import * as webpackMerge from 'webpack-merge';

import { commonConfig } from './webpack.server.common';

export default webpackMerge(commonConfig, {
  devtool: 'source-map',
  plugins: [
    new NoEmitOnErrorsPlugin(),
    new NormalModuleReplacementPlugin(
      /environments\/environment$/,
      require.resolve('../src/environments/environment.prod.ts')
    )
  ]
});
