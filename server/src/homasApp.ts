import express from 'express';
import {NextFunction, Request, Response} from 'express';
import {rateLimit} from 'express-rate-limit';
import {AwilixContainer} from 'awilix';
import {controller, scopePerRequest} from 'awilix-express';
import bodyParser from 'body-parser';
import path from 'path';
import mongoSanitize from 'express-mongo-sanitize';

import session from 'express-session';
import MongoStore from 'connect-mongo';

import passport from 'passport';

const LocalStrategy = require('passport-local').Strategy;
import cookieParser from 'cookie-parser';
import {doubleCsrf} from 'csrf-csrf';

import config from './homasConfig';
import {devClientMiddleware} from './middlewares/devClientMiddleware';
import authentication from './middlewares/authMiddleware';
import {configureContainer} from './homasDIContainer';
import {StatusCodes} from 'http-status-codes';
import UserController from './controllers/userController';
import AuthController from './controllers/authController';
import UserSchema from './mongo/schemas/userSchema';
import {morganMiddleware} from './helpers/morgan.middleware';

require('log-timestamp');

const reqLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    limit: 60, // Limit each IP to 60 requests per `window` (here, per 2 minutes)
    standardHeaders: 'draft-7', // Set `RateLimit` and `RateLimit-Policy` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // store: ... , // Use an external store for more precise rate limiting
});

// This is the default CSRF protection middleware.
const {generateToken} = doubleCsrf({getSecret: () => config.session.csrfSecret}); // doubleCsrfProtection

export const startHomasApp = async () => {
    const container: AwilixContainer = configureContainer();
    const {mongoAccess, logger} = container.cradle;

    const app = express();
    await mongoAccess.connect();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(
        session({
            secret: config.session.secret,
            resave: false,
            saveUninitialized: true,
            store: MongoStore.create({mongoUrl: config.mongoDBUri}),
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(cookieParser());
    app.use(mongoSanitize());
    app.use(morganMiddleware);

    passport.use(new LocalStrategy(UserSchema.authenticate()));
    passport.serializeUser(UserSchema.serializeUser());
    passport.deserializeUser(UserSchema.deserializeUser());

    app.use(function (_req: any, res: any, next: any) {
        res.removeHeader('X-Powered-By');
        next();
    });

    app.post('/login', async function (req: any, res: Response, next: NextFunction) {
        passport.authenticate('local', async function (err: any, userToLogin: any, info: any) {
            if (err) {
                req.logout(function (logoutErr: any) {
                    if (logoutErr) {
                        return next(logoutErr);
                    }

                    if (!res.headersSent) {
                        return res.redirect('/');
                    }
                });

                if (!res.headersSent) {
                    return res.redirect('/');
                }
                return;
            }

            if (!userToLogin) {
                return res.status(StatusCodes.NOT_FOUND).send(info);
            }

            req.logIn(userToLogin, async function (loginErr: any) {
                if (loginErr) {
                    req.logout(function (logoutErr: any) {
                        if (logoutErr) {
                            return next(logoutErr);
                        }
                        if (!res.headersSent) {
                            return res.redirect('/');
                        }
                    });

                    if (!res.headersSent) {
                        return res.redirect('/');
                    }
                    return;
                }

                const cleanUser = {
                    id: req.user.id,
                    phone: req.user.phone,
                    email: req.user.email,
                    username: req.user.username,
                };
                return res.status(StatusCodes.OK).send({user: cleanUser});
            });
        })(req, res, next);
    });

    app.post('/logout', async function (req: any, res: Response, next: NextFunction) {
        await req.logout(function (err: any) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
        res.status(StatusCodes.OK).send();
    });

    app.get('/csrf-token', (req: any, res: Response) => {
        const csrfToken = generateToken(req, res);
        // You could also pass the token into the context of a HTML response.
        res.json({csrfToken});
    });

    if (!config.isDevelopmentEnv) {
        app.use(express.static(path.join(__dirname, config.server.clientAppDirectory)));
        app.use('*', reqLimiter);
    }
    app.use(
        '/public_images',
        express.static(path.join(__dirname, config.server.clientAppDirectory, 'public_images'), {index: false}),
    );

    app.use(scopePerRequest(container));
    app.use(controller(AuthController));
    app.use('/api/*', authentication);

    app.use(controller(UserController));

    if (!config.isDevelopmentEnv) {
        app.get('/*', (_req: any, res: Response) => {
            res.sendFile(path.join(__dirname, `${config.server.clientAppDirectory}/index.html`));
        });
    } else {
        // '/images' is the only public directory available in react client
        app.use('/assets', async (req: Request, res: Response) => {
            return res.sendFile(
                path.join(__dirname, '../../', config.development.clientDevelopmentStaticPath, req.originalUrl),
            );
        });

        app.use('/styles', async (req: Request, res: Response) => {
            return res.sendFile(
                path.join(__dirname, '../../', config.development.clientDevelopmentStaticPath, req.originalUrl),
            );
        });

        app.use('/*', devClientMiddleware(config.development.clientHost, config.development.clientPort));
    }

    app.listen(config.server.port, async () => {
        logger.info(`Server is running on port ${config.server.port}.`);
    });
};
