import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true,
            required: true,
        },
        admin: {
            type: String,
            required: true,
        },
        started: {
            type: Boolean,
            default: false,
        },
        paused: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            required: true,
        },
        year: {
            type: String,
            required: true,
            default: 'yearOne',
        },
    },
    {
        timestamps: true,
    }
);

export let Games = mongoose.models.game || mongoose.model('game', gameSchema);
