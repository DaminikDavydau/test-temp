import mongoose from 'mongoose';
import { createResetPasswordToken } from '../../utils/generateToken';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        profile_picture: {
            type: String,
            default: null,
        },
        role: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

export let Users = mongoose.models.user || mongoose.model('user', userSchema);
