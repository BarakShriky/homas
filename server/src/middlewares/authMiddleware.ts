import {NextFunction, Response} from 'express';
import config from '../homasConfig';
import {Logger} from '../helpers/logger';

const authentication = async (req: any, res: Response, next: NextFunction) => {
    if (req.headers.apikey === config.server.apiKey) {
        // if apikey is passed, we skip authorization
        return next();
    }

    if (!req.isAuthenticated()) {
        Logger.error('not authenticated');
        req.logout(function (err: any) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
        return res.status(401).send({err: 'not authenticated'});
    }

    return next();
};

export default authentication;
