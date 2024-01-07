const http = require('http');
import {Response} from 'express';

export const devClientMiddleware = (host: string, port: number) => {
    return async (_req: any, res: Response): Promise<void> => {
        await http.get({host, port}, (response: any) => {
            let str: any = '';
            // Collect data chunks from response
            response.on('data', (chunk: string) => {
                str += chunk;
            });
            // Send collected data chunks when finished
            response.on('end', () => {
                res.send(str);
            });
        });
    };
};
