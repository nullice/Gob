/**
 * Created by nullice on 2017/4/5.
 */

import babel from 'rollup-plugin-babel';
export default {
    entry: 'src/Gob.js',
    format: 'umd',
    moduleName: "Gob",
    plugins: [

        babel({
            babelrc: false,
            plugins: ['transform-async-to-generator'],
        })
    ],
    dest: 'bin/Gob.umd.js', // equivalent to --output,
};
