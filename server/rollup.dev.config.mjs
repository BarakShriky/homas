import run from '@rollup/plugin-run';
import baseRollupConfig from './rollup.config';

const devRollupConfig = { ...baseRollupConfig };
devRollupConfig.plugins.push(run());

export default devRollupConfig;
