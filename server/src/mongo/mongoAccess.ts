import mongoose from 'mongoose';
import config from '../homasConfig';
import {Logger} from '../helpers/logger';

class MongoAccess {
    async connect() {
        const dbUri = config.mongoDBUri;

        mongoose.connection.on('connected', () => {
            Logger.info(`Mongoose default connection open to ${dbUri}`);
        });

        mongoose.connection.on('error', (err: any) => {
            Logger.error(`Mongoose default connection error ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            Logger.info('Mongoose default connection disconnected');
        });
        await mongoose.connect(dbUri, {
            autoIndex: true,
        });

        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', true);
        }
    }

    static async disconnect() {
        await mongoose.disconnect();
    }
}

export default MongoAccess;
