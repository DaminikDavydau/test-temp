import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema(
    {
        game_id: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
            default: false,
        },
        owner: {
            type: String,
            default: null,
        },
        timesUsed: {
            type: Number,
            default: 0,
        },
        soldFor: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export let Machines =
    mongoose.models.machine || mongoose.model('machine', machineSchema);
