import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema(
    {
        game_id: {
            type: String,
            required: true,
        },
        key: {
            type: String,
            required: true,
        },
        is_bancrupt: {
            type: Boolean,
            required: true,
            default: false,
        },
        bancrupcy_year: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

export let Businesses = mongoose.models.business || mongoose.model('business', businessSchema);
