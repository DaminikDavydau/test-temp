import cors from 'cors';
import express from 'express';
import * as dotenv from 'dotenv';
import mongoose, { ConnectOptions } from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { userRouter } from './logic/user/router';
import { gameRouter } from './logic/game/router';
import { playerRouter } from './logic/player/router';
import { investmentRouter } from './logic/investment/router';
import { businessRouter } from './logic/business/router';
import { reportRouter } from './logic/reports/router';
import { machineRouter } from './logic/machine/router';
import { languageRouter } from './logic/language/router';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(
    fileUpload({
        useTempFiles: true,
    })
);

app.use('/api/user', userRouter);
app.use('/api/game', gameRouter);
app.use('/api/player', playerRouter);
app.use('/api/investment', investmentRouter);
app.use('/api/business', businessRouter);
app.use('/api/report', reportRouter);
app.use('/api/machine', machineRouter);
app.use('/api/language', languageRouter);

const URI = process.env.MONGODB_URL;

if (URI) {
    mongoose.connect(
        URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions,
        (err) => {
            if (err) throw err;
            console.log('Connected to DB');
        }
    );

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log('Server running on port', PORT);
    });
}
