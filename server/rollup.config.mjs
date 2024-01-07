import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import eslint from '@rollup/plugin-eslint';
import copy from 'rollup-plugin-copy';
import pkg from './package.json';
const extensions = ['.js', '.ts'];

export default {
    input: './src/index.ts',
    output: [
        {
            file: pkg.mainDirectory + '/' + pkg.main,
            format: 'cjs',
            sourcemap: true,
        },
    ],
    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en#external-e-external`
    external: ['axios', 'http', 'path', 'loglevel', 'glob', 'request', 'mongoose'],
    plugins: [
        copy({
            targets: [
                { src: '../client/build/**', dest: 'dist/clientApp' },
            ],
        }),
        json(),
        // Allows node_modules resolution
        resolve({ extensions, preferBuiltins: true }),
        // // run eslint
        eslint({
            throwOnError: true,
        }),
        commonjs({ ignoreDynamicRequires: true }),
        babel({
            extensions,
            babelHelpers: 'runtime',
            include: ['src/**/*'],
            skipPreflightCheck: true,
        }),
    ],
    onwarn: function (warning) {
        // Skip certain warnings

        // should intercept ... but doesn't in some rollup versions
        if (warning.code === 'THIS_IS_UNDEFINED') {
            return;
        }

        // console.warn everything else
        console.warn(warning.message);
    },
};
