import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema(
    {
        language_id: {
            type: String,
            required: true,
            unique: true,
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

export let Languages =
    mongoose.models.language || mongoose.model('language', languageSchema);
