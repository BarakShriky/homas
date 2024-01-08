import {MongoUserDocument, UserModel} from '../models/userModel';

export class UserMapper {
    toUserModel(userDocument: MongoUserDocument | null): UserModel {
        if (!userDocument) throw new Error('cannot convert null to user model');
        return new UserModel(userDocument.firstName,
            userDocument.lastName,
            userDocument.identityNumber,
            userDocument.company,
            userDocument.companyAddress,
            userDocument.role,
            userDocument.phone,
            userDocument.email,
        );
    }
}
