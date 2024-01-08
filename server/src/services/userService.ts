import {UserMapper} from '../mappers/userMapper';
import {Request} from 'express';
import {UserRepository} from '../mongo/repositories/userRepository';
import User from '../mongo/schemas/userSchema';
import {MongoUserDocument} from '../models/userModel';
import Logger from '../helpers/logger';

export default class UserService {
    constructor(
        private userRepository: UserRepository,
        private userMapper: UserMapper,
        private logger: Logger,
    ) {
    }

    async getUsers() {
        const users = await this.userRepository.findAsync<MongoUserDocument>({});
        return users.map((user: MongoUserDocument) => this.userMapper.toUserModel(user));
    }

    async getUser(id: string) {
        const user: MongoUserDocument = await this.userRepository.findById(id);
        return this.userMapper.toUserModel(user);
    }

    async createUser(req: Request) {
        const {firstName, lastName, identityNumber, company, companyAddress, role, phone, email} =
            req.body;
        // Email uniqueness enforced by mongodb, will throw MongoServerError: E11000 on violation
        const user = new User({email, phone, role, firstName, lastName, identityNumber, company, companyAddress});
        await user.save();
        return this.userMapper.toUserModel(user);
    }

    async updateUser(id: string, body: any) {
        const userFromDb: any = await this.userRepository.findById(id);
        if (!userFromDb) {
            this.logger.error(`user with id ${id} does not exists`);
            throw new Error('user Not Exist');
        }
        await this.userRepository.updateOne({_id: id}, {...body});
        const updatedUser = await this.userRepository.findById<MongoUserDocument>(id);
        return this.userMapper.toUserModel(updatedUser);
    }


    async deleteUser(req: Request) {
        const {id} = req.params;
        await this.userRepository.findByIdAndDelete(id);
    }
}
