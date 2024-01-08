import {route, POST} from 'awilix-express';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import Logger from '../helpers/logger';
import {UserRepository} from '../mongo/repositories/userRepository';

@route('/api/auth')
export default class AuthController {
    constructor(
        private logger: Logger,
        private userRepository: UserRepository,
    ) {}

    @POST()
    @route('/verify_token/:token')
    async verifyToken(req: Request, res: Response) {
        try {
            const resetToken = String(req.params.token);

            const user: any = await this.userRepository.findOne({resetToken, expireToken: {$gt: Date.now()}});
            if (!user) {
                this.logger.info(`Failed to verify token`);
                return res.status(StatusCodes.FORBIDDEN).send({
                    success: false,
                    message: 'Token is invalid or has expired',
                });
            }
            res.status(StatusCodes.OK);
        } catch (e: any) {
            this.logger.error(e);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: 'ריסוט סיסמה נכשל, נסה לינק חדש',
            });
        }
    }
}
