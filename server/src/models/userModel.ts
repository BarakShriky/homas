import mongoose from 'mongoose';

export class UserModel {
    constructor(
        public firstName: string,
        public lastName: string,
        public identityNumber: string,
        public company: string,
        public companyAddress: string,
        public role: string,
        public phone: string,
        public email: string,
    ) {
    }
}

export interface MongoUserDocument extends mongoose.Document, UserModel {
}
