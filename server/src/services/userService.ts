import {UserMapper} from '../mappers/userMapper';
import {Request} from 'express';
import {UserRepository} from '../mongo/repositories/userRepository';
import User from '../mongo/schemas/userSchema';
import {MongoUserDocument} from '../models/userModel';
import Logger from '../helpers/logger';

type Notification = {
    text: string;
    read: boolean;
    type: string;
};

export default class UserService {
    constructor(
        private userRepository: UserRepository,
        private userMapper: UserMapper,
        private logger: Logger,
    ) {}

    async getUsers() {
        const users = await this.userRepository.findAsync<MongoUserDocument>({});
        return users.map((user: MongoUserDocument) => this.userMapper.toUserModel(user).parseForSending());
    }

    async getUsersAsModel() {
        const users = await this.userRepository.findAsync<MongoUserDocument>({});
        return users.map((user: MongoUserDocument) => this.userMapper.toUserModel(user));
    }

    async getUser(id: string) {
        const user: MongoUserDocument = await this.userRepository.findById(id);
        return this.userMapper.toUserModel(user).parseForSending();
    }

    async getUserExclusionsIds(id: string) {
        const user: MongoUserDocument = await this.userRepository.findById(id);
        return user.exclusions;
    }

    async createUser(req: Request) {
        const {email, hebName, arabName, engName, rusName, contactName, phone, role, logo, username, password, rashutId} =
            req.body;
        // Email uniqueness enforced by mongodb, will throw MongoServerError: E11000 on violation
        const user = new User({
            email,
            hebName,
            arabName,
            engName,
            rusName,
            contactName,
            phone,
            role,
            logo,
            username,
            password,
            rashutId,
        });
        await user.setPassword(password);
        await user.save();
        return this.userMapper.toUserModel(user).parseForSending();
    }

    async resetPassword(resetToken: string, newPassword: string) {
        const user = await User.findOne({resetToken, expireToken: {$gt: Date.now()}});
        if (!user) {
            this.logger.error(`Failed to find user or Token is invalid or has expired`);
            throw new Error('Failed to find user or Token is invalid or has expired');
        }
        await user.setPassword(newPassword);
        user.resetPassToken = undefined;
        user.expireToken = undefined;
        await user.save();
        this.logger.info(`Password reset successfully for user:${user.username}`);
    }

    async changePassword(userId: string, newPassword: string) {
        const user = await User.findById(userId);
        if (!user) {
            this.logger.error(`Failed to find user ${userId}`);
            throw new Error(`Failed to find user ${userId}`);
        }

        await user.setPassword(newPassword);
        user.resetPassToken = undefined;
        user.expireToken = undefined;
        await user.save();

        this.logger.info(`Password set successfully for user:${user.username}`);
    }

    async updateUser(id: string, body: any) {
        const userFromDb: any = await this.userRepository.findById(id);
        if (!userFromDb) {
            this.logger.error(`user with id ${id} does not exists`);
            throw new Error('user Not Exist');
        }
        await this.userRepository.updateOne({_id: id}, {...body});
        const updatedUser = await this.userRepository.findById<MongoUserDocument>(id);
        return this.userMapper.toUserModel(updatedUser).parseForSending();
    }

    async addExclusionToUser(email: string, exclusion: string) {
        const userFromDb = await this.userRepository.findOne({email: email});
        if (!userFromDb) {
            throw new Error('user Not Exist');
        }
        await this.userRepository.updateOne(
            {_id: userFromDb._id},
            // @ts-ignore
            {exclusions: userFromDb.exclusions ? [...userFromDb.exclusions, exclusion] : [exclusion]},
        );
        const updatedUser = await this.userRepository.findById<MongoUserDocument>(userFromDb._id);
        return this.userMapper.toUserModel(updatedUser).parseForSending();
    }

    async addNotification(email: string, notification: Notification) {
        const userFromDb = await this.userRepository.findOne({email: email});
        if (!userFromDb) {
            throw new Error('user Not Exist');
        }
        await this.userRepository.updateOne(
            {_id: userFromDb.id},
            // @ts-ignore
            {notifications: userFromDb.notifications ? [...userFromDb.notifications, notification] : [notification]},
        );
        const updatedUser = await this.userRepository.findById<MongoUserDocument>(userFromDb._id);
        return this.userMapper.toUserModel(updatedUser).parseForSending();
    }

    async markNotificationsAsRead(id: string) {
        const userFromDb = await this.userRepository.findOne({_id: id});
        if (!userFromDb) {
            throw new Error('user Not Exist');
        }
        let modifiedNotifications =
            // @ts-ignore
            userFromDb?.notifications.length > 10 ? userFromDb?.notifications.slice(-10) : userFromDb?.notifications;
        modifiedNotifications = modifiedNotifications.map((notification: Notification) => ({
            ...notification,
            read: true,
        }));
        await this.userRepository.updateOne(
            {_id: id},
            // @ts-ignore
            {notifications: modifiedNotifications},
        );
        const updatedUser = await this.userRepository.findById<MongoUserDocument>(userFromDb._id);
        return this.userMapper.toUserModel(updatedUser).parseForSending();
    }

    async deleteUser(req: Request) {
        const {id} = req.params;
        await this.userRepository.findByIdAndDelete(id);
    }

    async deleteExclusionsFromUsers(req: Request, usersToRemoveFrom: [string]) {
        const {id} = req.params;
        await Promise.all(
            usersToRemoveFrom.map(async (userEmail) => {
                const userData = await this.userRepository.find({email: userEmail});
                // @ts-ignore
                const modifiedExclusions = userData.exclusions.filter((exclusionId) => exclusionId !== id);
                await this.userRepository.updateOne({email: userEmail}, {exclusions: modifiedExclusions});
            }),
        );
    }
}
