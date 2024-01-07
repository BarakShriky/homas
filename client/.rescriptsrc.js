const {editWebpackPlugin} = require('@rescripts/utilities');

module.exports = (config) => {
    const isDevEnv = process.env.NODE_ENV === 'development';

    if (isDevEnv) {
        const clientPort = 3000;
        config.output.publicPath = `http://homas.local:${clientPort}/`;

        // For react-notifications icon fonts
        const modifiedRules = config.module.rules.map((rule) => {
            if ('oneOf' in rule) {
                rule.oneOf.unshift({
                    test: [/\.woff$/, /\.woff2$/, /\.ttf$/],
                    loader: require.resolve('url-loader'),
                });
            }
            return rule;
        });

        // WDS_SOCKET_PORT defines the hot reload socket port for react file changes listener
        config = editWebpackPlugin(
            (plugin) => {
                plugin.definitions['process.env']['WDS_SOCKET_PORT'] = JSON.stringify(3000);
                return plugin;
            },
            'DefinePlugin',
            config,
        );

        config.module.rules = modifiedRules;
    }
    return config;
};
