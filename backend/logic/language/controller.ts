import fs from 'fs';
import { Languages } from './model';

export const languageCtrl = {
    get: async (req: any, res: any) => {
        try {
            const { language_id } = req.params;

            const language = await Languages.findOne({
                language_id: language_id,
            });

            res.json(JSON.parse(language.value));
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    deleteOne: async (req: any, res: any) => {
        try {
            const { language_id } = req.params;

            await Languages.deleteOne({
                _id: language_id,
            });

            res.json({ msg: 'Language deleted' });
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    getAll: async (req: any, res: any) => {
        try {
            const languages = await Languages.find({}).select({
                language_id: true,
            });

            res.json(languages);
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    upload: async (req: any, res: any) => {
        try {
            const language_file = req.files.language_file;
            if (!language_file.name.endsWith('.json')) {
                return res.status(500).json({
                    err: 'not-json',
                });
            }

            const languageName = language_file.name
                .replace('.json', '')
                .toLowerCase();

            const tempDirName = './temp';
            if (!fs.existsSync(tempDirName)) {
                fs.mkdirSync(tempDirName, { recursive: true });
            }
            const filePath =
                tempDirName + '/' + language_file.name.toLowerCase();
            await language_file.mv(filePath);
            const fileValue = fs.readFileSync(filePath, { encoding: 'utf8' });
            fs.unlinkSync(filePath);

            await Languages.updateOne(
                { language_id: languageName },
                {
                    language_id: languageName,
                    value: fileValue,
                },
                { upsert: true }
            );

            const newLanguage = await Languages.findOne({
                language_id: languageName,
            }).select({
                language_id: true,
            });

            res.json(newLanguage);
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
};
