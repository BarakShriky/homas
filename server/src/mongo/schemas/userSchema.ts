import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export const UserSchema = new mongoose.Schema({
    phone: {type: String, required: false},
    email: {type: String, required: false},
    username: {type: String, required: false},
    idNumber: {type: String, required: false},
});

UserSchema.plugin(passportLocalMongoose, {
    iterations: 210_000,
    digestAlgorithm: 'sha512',
    usernameCaseInsensitive: true,
    limitAttempts: true,
    maxAttempts: 15,
    unlockInterval: 3600,
});

export default mongoose.model('user', UserSchema);
