import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema(
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

export let Investments = mongoose.models.investment || mongoose.model('investment', investmentSchema);
