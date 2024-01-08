import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    identityNumber: {type: String, required: false},
    company: {type: String, required: false},
    companyAddress: {type: String, required: false},
    role: {type: String, required: false},
    phone: {type: String, required: false},
    email: {type: String, required: false},
});

export default mongoose.model('user', UserSchema);
