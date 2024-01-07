import {RepositoryBase} from './repositoryBase';
import UserSchema from '../schemas/userSchema';
import {MongoUserDocument} from '../../models/userModel';

export class UserRepository extends RepositoryBase<MongoUserDocument> {
    constructor() {
        super(UserSchema as any);
    }
}

Object.seal(UserRepository);
