import { createReportSheets as createGameOneSheets } from '../../../engine/bancrupt/export/createSheets';
import { createReportSheets as createGameTwoSheets } from '../../../engine/crisis-year/export/createSheets';
import { createReportSheets as createGameThreeSheets } from '../../../engine/slower-drive/export/createSheets';
import { createReportSheets as createGameFourSheets } from '../../../engine/production/export/createSheets';
import { createReportSheets as createGameFiveSheets } from '../../../engine/hotel/export/createSheets';
import { createReportSheets as createGameSixSheets } from '../../../engine/barber/export/createSheets';

import { Game as GameOne } from '../../../engine/bancrupt/game';
import { Game as GameTwo } from '../../../engine/crisis-year/game';
import { Game as GameThree } from '../../../engine/slower-drive/game';
import { Game as GameFour } from '../../../engine/production/game';
import { Game as GameFive } from '../../../engine/hotel/game'
import { Game as GameSix } from '../../../engine/barber/game'

import { GameBase } from '../../../engine/types/GameBase';
import Excel from 'exceljs';

export const gameClasses: Record<string, typeof GameBase> = {
    'Bankrots': GameOne,
    'Krīzes gads': GameTwo,
    'Lēnāk brauksi - tālāk tiksi': GameThree,
    'Ražošana': GameFour,
    'Viesnīca': GameFive,
    'Frizētava': GameSix
};

export const sheetFunctions: Record<
    string,
    (gameAdmin: string, reports: any[], english: boolean) => Promise<Excel.Workbook>
> = {
    'Bankrots': createGameOneSheets,
    'Krīzes gads': createGameTwoSheets,
    'Lēnāk brauksi - tālāk tiksi': createGameThreeSheets,
    'Ražošana': createGameFourSheets,
    'Viesnīca': createGameFiveSheets,
    'Frizētava': createGameSixSheets,
};
