import express from 'express';
import { languageCtrl } from './controller';

export const languageRouter = express.Router();

languageRouter.route('/').get(languageCtrl.getAll);

languageRouter
    .route('/:language_id')
    .get(languageCtrl.get)
    .delete(languageCtrl.deleteOne);

languageRouter.route('/upload').post(languageCtrl.upload);
