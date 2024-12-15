import { Games } from './model';
import { Investments } from '../investment/model';
import { Players } from '../player/model';
import { Businesses } from '../business/model';
import { GameInterface } from './interfaces';
import { UserInterface } from '../user/interfaces';
import { PlayerInterface } from '../player/interfaces';
import { generateGameKey } from '../../utils/generateCode';
import { gameClasses, sheetFunctions } from './gameManager/gameClasses';

import {
    createPlayersRecords,
    createInvestmentsRecords,
    createBusinessesRecords,
    createPlayerReport,
    createMachinesRecords,
    createPlayersNamesRecords,
} from './gameManager/createRecords';
import { Reports } from '../reports/model';
import { IPlayerReport } from '../../engine/types/IPlayerReport';
import { Users } from '../user/model';
import { Machines } from '../machine/model';

export const gameCtrl = {
    create: async (req: any, res: any) => {
        try {
            const { type } = req.body;
            const authAdmin: UserInterface = req.user;

            const adminTest = await Games.findOne({ admin: authAdmin._id });
            if (adminTest) {
                return res.status(400).json({
                    err: 'one-game-allowed',
                });
            }

            const games: GameInterface[] = await Games.find();

            const code = generateGameKey(games);
            if (!code) {
                return res.status(500).json({
                    err: 'code-failed',
                });
            }

            const new_game = new Games({
                type: type,
                admin: authAdmin._id,
                code: code,
            });
            await new_game.save();

            res.json({
                msg: 'Spēle izveidota',
                game: new_game,
            });
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    getOne: async (req: any, res: any) => {
        try {
            const { game_id } = req.params;

            const game = await Games.findById({ _id: game_id });
            if (!game) {
                return res.status(400).json({ err: 'game-not-found' });
            }

            res.json(game);
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    remove: async (req: any, res: any) => {
        try {
            const { game_id } = req.params;

            const authAdmin: UserInterface = req.user;

            const game = await Games.findOne({
                _id: game_id,
                admin: authAdmin._id,
            });

            if (!game) {
                return res.status(400).json({ err: 'game-not-found' });
            }

            await Businesses.find({ game_id: game_id }).deleteMany();
            await Investments.find({ game_id: game_id }).deleteMany();
            await Players.find({ game_id: game_id }).deleteMany();
            await Machines.find({ game_id: game_id }).deleteMany();
            await Reports.find({ game_id: game_id }).deleteMany();

            await game.deleteOne({
                _id: game_id,
                admin: authAdmin._id,
            });

            res.json({ msg: 'Spēle dzēsta' });
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    pause: async (req: any, res: any) => {
        try {
            const { game_id } = req.params;

            const authAdmin: UserInterface = req.user;

            const game = await Games.findOne({
                _id: game_id,
                admin: authAdmin._id,
            });

            const prev_paused = game.paused;

            await game.updateOne({ paused: !prev_paused });

            res.json({ msg: 'Spēle pauzēta', paused: !prev_paused });
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    start: async (req: any, res: any) => {
        try {
            const { game_id } = req.params;

            const authAdmin: UserInterface = req.user;

            const game = await Games.findOne({
                _id: game_id,
                admin: authAdmin._id,
            });

            await game.updateOne({ started: true });

            const Game = gameClasses[game.type];

            for (const businessKey of Game.businessKeys) {
                const new_business = new Businesses({
                    game_id: game_id,
                    key: businessKey,
                });
                await new_business.save();
            }

            const playerAmount = (await Players.find({ game_id: game_id }))
                .length;

            if (Game.requiresMachines) {
                const machines = Game.getMachines(playerAmount);

                for (const machine of machines) {
                    const new_machine = new Machines({
                        game_id: game_id,
                        ...machine,
                    });
                    await new_machine.save();
                }
            }

            res.json({ msg: 'Spēle sākta' });
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    submitInvestment: async (req: any, res: any) => {
        try {
            const { game_id } = req.params;
            const { investment } = req.body;

            const authPlayer: PlayerInterface = req.user;

            if (authPlayer.game_id !== game_id || authPlayer.is_bancrupt) {
                return res.status(400).json({ err: 'cant-invest' });
            }

            const game = (await Games.findOne({
                _id: game_id,
            })) as GameInterface | null;

            if (!game) {
                return res.status(400).json({ err: 'game-not-found' });
            }

            const existingInvestment = await Investments.findOne({
                game_id: authPlayer.game_id,
                player_id: authPlayer._id,
                year: game.year,
            });

            if (existingInvestment) {
                return res.status(400).json({ err: 'cant-invest' });
            }

            const playerInvestments = JSON.parse(investment);
            const playerAssets = authPlayer.assets;
            const Game = gameClasses[game.type];
            const dataValid = Game.validatePlayerInvestments(
                playerAssets,
                playerInvestments
            );

            if (!dataValid) {
                return res.status(400).json({ err: 'wrong-data' });
            }

            const investmentValue = JSON.stringify({
                initialAssets: playerAssets,
                investments: playerInvestments,
                investmentTime: new Date(),
            });

            const new_investment = new Investments({
                game_id: game_id,
                player_id: authPlayer._id,
                year: game.year,
                value: investmentValue,
            });

            await new_investment.save();

            const totalExpenses = Math.round(
                Game.getPlayerYearlyCosts(authPlayer.assets, playerInvestments)
            );
            const remainingAssets = Math.round(playerAssets + totalExpenses);

            const player = await Players.findOne({
                _id: authPlayer._id,
                game_id: game_id,
            });

            await player.updateOne({ assets: remainingAssets });

            res.json({
                msg: 'Investīcijas veiktas',
                investment: new_investment,
                totalExpenses: totalExpenses,
            });
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    endTurn: async (req: any, res: any) => {
        try {
            const { game_id } = req.params;

            const authAdmin: UserInterface = req.user;
            const game = await Games.findOne({
                _id: game_id,
                admin: authAdmin._id,
            });

            const players = createPlayersRecords(
                await Players.find({
                    game_id: game_id,
                    is_bancrupt: false,
                }).select(['_id', 'assets'])
            );
            const investments = createInvestmentsRecords(
                await Investments.find({
                    game_id: game_id,
                    year: game.year,
                }).select(['player_id', 'value'])
            );
            const businesses = createBusinessesRecords(
                await Businesses.find({ game_id: game_id }).select([
                    'key',
                    'is_bancrupt',
                    'bancrupcy_year',
                ])
            );
            const machines = createMachinesRecords(
                await Machines.find({ game_id: game_id }).select([
                    'type',
                    'number',
                    'owner',
                    'timesUsed',
                    'soldFor',
                ])
            );

            const Game = gameClasses[game.type];

            const reports: IPlayerReport[] = [];
            const allPlayers = await Players.find({
                game_id: game_id,
            });
            if (Game.requiresHistory) {
                const playerNames = createPlayersNamesRecords(allPlayers);
                for (const player of allPlayers) {
                    const yearReportFromDb = await Reports.find({
                        game_id: game_id,
                        player_id: player._id,
                    });

                    reports.push(
                        createPlayerReport(
                            player,
                            yearReportFromDb,
                            game.type,
                            playerNames
                        )
                    );
                }
            }

            const gameObject = new Game(
                players,
                businesses,
                machines,
                investments,
                reports,
                game.year
            );

            const yearResult = gameObject.doMove();

            if (!yearResult.year) {
                await game.updateOne({ started: false });
            } else {
                await game.updateOne({ year: yearResult.year });
            }

            if (
                game.type == 'Ražošana' ||
                game.type == 'Lēnāk brauksi - tālāk tiksi'
            ) {
                await game.updateOne({ started: gameObject.isActive() });
            }

            for (const businessKey of Game.businessKeys) {
                const business = await Businesses.findOne({
                    game_id: game.id,
                    key: businessKey,
                });
                await business.updateOne({
                    is_bancrupt: yearResult.bancrupcies[businessKey].isBancrupt,
                    bancrupcy_year:
                        yearResult.bancrupcies[businessKey].bancrupcyYear,
                });
            }

            for (const playerKey of Object.keys(yearResult.assets)) {
                const player = await Players.findOne({ _id: playerKey });
                const teammates =
                    yearResult.teams
                        .find((x) => x.includes(playerKey))
                        ?.toString() || null;

                await player.updateOne({
                    assets: yearResult.assets[playerKey],
                    is_bancrupt: yearResult.playerBancrupcies[playerKey],
                    teammates: teammates,
                });
            }

            if (Game.requiresMachines) {
                const machines = yearResult.bancrupcies;

                for (const [number, data] of Object.entries(machines)) {
                    const machine = await Machines.findOne({
                        number: number,
                        game_id: game_id,
                    });
                    await machine.updateOne({
                        owner: data.owner,
                        soldFor: data.soldFor,
                    });
                }
            }

            const yearReports = Game.getPlayersReports(yearResult);
            for (const report of yearReports) {
                const new_report = new Reports({
                    game_id: game_id,
                    player_id: report.playerKey,
                    year: report.yearKey || game.year,
                    value: JSON.stringify(report),
                });
                await new_report.save();
            }

            res.json(yearResult);
        } catch (err: any) {
            throw err;
            return res.status(500).json({ err: err.message });
        }
    },
    getInvestmentReturn: async (req: any, res: any) => {
        try {
            const { game_id } = req.params;
            const { investment } = req.body;

            const game = await Games.findOne({ _id: game_id });
            const Game = gameClasses[game.type];

            const investmentObject = JSON.parse(investment);
            const investmentReturn = Game.getInvestmentReturn(investmentObject);

            res.json(investmentReturn);
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    downloadSheet: async (req: any, res: any) => {
        try {
            const { game_id, language } = req.params;

            const allReports: IPlayerReport[] = [];
            const game = await Games.findOne({ _id: game_id });
            const players = await Players.find({ game_id: game_id });
            const gameType = game.type;
            const gameAdmin = (await Users.findOne({ _id: game.admin })).name;

            for (const player of players) {
                const playerNames = createPlayersNamesRecords(players);
                const yearReportFromDb = await Reports.find({
                    game_id: game_id,
                    player_id: player._id,
                });

                allReports.push(
                    createPlayerReport(
                        player,
                        yearReportFromDb,
                        gameType,
                        playerNames
                    )
                );
            }

            const today = new Date();
            const sheetFile = `gamereport_${today.getFullYear()}-${today.getMonth()}-${today.getDay()}.xlsx`;

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=' + sheetFile
            );

            const english = language != 'lv';
            const createSheets = sheetFunctions[gameType];
            const workbook = await createSheets(gameAdmin, allReports, english);

            await workbook.xlsx.write(res);
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
};
