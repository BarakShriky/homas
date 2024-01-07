import {route, GET, PUT, DELETE, POST} from 'awilix-express';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import UserService from '../services/userService';
import Logger from '../helpers/logger';

@route('/api/user')
export default class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    @GET()
    async getUsers(req: any, res: any) {
        try {
            const parsedUsers = await this.userService.getUsers();
            return res.send({success: true, data: parsedUsers});
        } catch (e: any) {
            this.logger.error(e.toString());
            res.send({success: false, message: 'קבלת משתמשים נכשלה'});
        }
    }

    @GET()
    @route('/:id')
    async getUser(req: any, res: any) {
        try {
            const user = await this.userService.getUser(req.params.id);
            res.send({success: true, user});
        } catch (e: any) {
            this.logger.error(e.toString());
            res.send({success: false, message: 'קבלת משתמש נכשלה'});
        }
    }

    @POST()
    async createUser(req: Request, res: Response) {
        if (!req.body) {
            res.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'request should contain instructions for user',
            });
            return;
        }
        try {
            const data = await this.userService.createUser(req);
            this.logger.info(`a new user with email ${req.body.email} created successfully`);
            res.send({success: true, data});
        } catch (e: any) {
            this.logger.error(e);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({success: false, message: 'יצירת משתמש נכשלה'});
        }
    }

    @PUT()
    @route('/:id')
    async updateUser(req: any, res: any) {
        if (!req.body) {
            res.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'request should contain instructions for user',
            });
            return;
        }
        try {
            const data = await this.userService.updateUser(req.params.id, req.body);
            res.send({success: true, data});
        } catch (e: any) {
            this.logger.error(e);
            res.send({success: false, message: 'עדכון משתמש נכשל'});
        }
    }

    @DELETE()
    @route('/:id')
    async deleteUser(req: any, res: any) {
        try {
            await this.userService.deleteUser(req);
            res.send({success: true, message: 'user deleted successfully'});
        } catch (e: any) {
            this.logger.error(e);
            res.send({success: false, message: 'failed to delete image'});
        }
    }
}
