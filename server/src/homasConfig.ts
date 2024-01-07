const env = require('env-var');

export default {
    server: {
        port: env.get('RAMZOR_PORT').default('80').asString(),
        //If default of null is taken, we will use the 'auto' option to select according to the connection type (https/http)
        clientAppDirectory: env.get('HOMAS_CLIENT_APP_DIRECTORY').default('clientApp').asString(),
        clientDirectory: env.get('HOMAS_CLIENT_APP_DIRECTORY').default('../../client').asString(),
        apiKey: env.get('HOMAS_API_KEY').asString(),
    },
    logger: {
        filePath: env.get('HOMAS_LOG_FILE_NAME').default('app.json').asString(),
    },
    development: {
        clientDevelopmentStaticPath: env.get('HOMAS_STATIC_PATH').default('client/public/').asString(),
        clientHost: '127.0.0.1',
        clientPort: 3000,
    },
    email: {
        smtpHost: env.get('SMTP_HOST').default('127.0.0.1').asString(),
        port: env.get('SMTP_PORT').default(1025).asPortNumber(),
        username: env.get('SMTP_USERNAME').default('apikey').asString(),
        password: env.get('SMTP_PASSWORD').default('').asString(),
    },
    multer: {
        maxSize: env.get('UPLOAD_MAX_SIZE').default(1048576),
    },
    session: {
        secret: env.get('HOMAS_SESSION_SECRET').default('SOME_SECRET').asString(),
        csrfSecret: env.get('HOMAS_CSRF_SECRET').asString(),
    },
    mongoDBUri: env.get('HOMAS_MONGO_URI').default('mongodb://127.0.0.1:27017/homas').asString(),
    isDevelopmentEnv: env.get('NODE_ENV').asString() === 'development',
};
