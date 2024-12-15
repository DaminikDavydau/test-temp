import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        assets: {
            type: Number,
            required: true,
        },
        is_bancrupt: {
            type: Boolean,
            required: true,
            default: false,
        },
        game_id: {
            type: String,
            required: true,
        },
        teammates: {
            type: String, 
            required: false,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export let Players =
    mongoose.models.player || mongoose.model('player', playerSchema);
