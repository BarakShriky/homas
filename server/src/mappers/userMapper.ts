import {MongoUserDocument, UserModel} from '../models/userModel';

export class UserMapper {
    toUserModel(userDocument: MongoUserDocument | null): UserModel {
        if (!userDocument) throw new Error('cannot convert null to user model');
        return new UserModel(userDocument.phone, userDocument.email, userDocument.username, userDocument.idNumber);
    }
}
