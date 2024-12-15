import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
    {
        game_id: {
            type: String,
            required: true,
        },
        player_id: {
            type: String,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export let Reports = mongoose.models.report || mongoose.model('report', reportSchema);
