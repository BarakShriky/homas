import mongoose from 'mongoose';

export class UserModel {
    constructor(
        public phone: string,
        public email: string,
        public username: string,
        public idNumber: string,
    ) {}
}

export interface MongoUserDocument extends mongoose.Document, UserModel {}
