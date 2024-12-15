import { createSlice } from '@reduxjs/toolkit';
import {
    budgetFromStars,
    locFromLV,
    skillFromStars,
    starsFromSkill,
    touristAmountFromEn,
} from '../../constants/G6Constants';
import { IBarber, IBarbershop, IPlayer } from '../../types/barber';
import { BusinessInterface } from '../../types/business';
import { GameInterface } from '../../types/game';
import { InvestmentInterface } from '../../types/investment';
import { IConstructionData, IPlayerReport } from '../../types/IPlayerReport';
import { IYearResult } from '../../types/IYearResult';
import { MachineInterface } from '../../types/machine';
import { PlayerInterface } from '../../types/player';
import { UserInterface } from '../../types/user';
import { getBarbershopExpenses } from '../../utils/getBarbershopExpenses';
import {
    getBuildingToU,
    getPriceFromBuilding,
    translateBuilding,
} from '../../utils/getBuildingFromPrice';
import prevGameYearString from '../../utils/getPrevYearString';

export interface InvestmentsInterface {
    iv1: number;
    iv2: number;
    iv3: number;
    iv4: number;
    iv5: number;
}

export interface Bancrupcies {
    b1: boolean;
    b2: boolean;
    b3: boolean;
    b4: boolean;
    b5: boolean;
}

export interface HistoryPeace {
    year: GameInterface['year'];
    pigs: number;
}

export interface G3HistoryPeace {
    hour: GameInterface['year'];
    speed: number;
    penalty: number;
}

export interface G5HistoryPeace {
    year: GameInterface['year'];
    averagePrice: number;
    price: number;
    clients: number;
}

export interface BBSIncome {
    equipmentCosts: number;
    incomesFromClients: number;
    labourCosts: number;
    learningCosts: number;
    salonCosts: number;
    marketingCosts: number;
    sellCosts: number;
}

export interface G4Data {
    machines: null | MachineInterface[];
    playerMachine: null | MachineInterface;
    team: null | string[];
    g4Investment: string | null;
    g4InvestmentTest: string | null;
    investmentReturns: null | Record<
        string,
        Record<string, Record<string, number>>
    >;
    playerTeam: null | PlayerInterface[];
    teammateResult: string | null;
    teamMachines: null | MachineInterface[];
    teamResults: boolean;
    teams: string[][] | null;
}

export interface G6Data {
    rulePage: number;
    choosingBarberShop: boolean;
    barbershops: IBarbershop[];
    savedBarbershops: IBarbershop[];
    g6InvestmentPage: number | null;
    newBarbershop: IBarbershop;
    barbershopExpenses: number;
    playerBarbershops: Record<string, IBarbershop[]>;
    editing: boolean;
    playerSkill: IPlayer;
    prevIndex: number | null;
}

export interface GameInfo {
    activeGame: null | GameInterface;
    players: null | PlayerInterface[];
    admin: null | UserInterface;
    playerInfo: null | PlayerInterface;
    joined: boolean;
    gameInvestments: null | InvestmentInterface[];
    investments: InvestmentsInterface;
    bancrupcies: null | Record<string, boolean>;
    businesses: null | BusinessInterface[];
    returns: null | Record<string, Record<string, number>>;
    secondGameHistory: null | HistoryPeace[];
    thirdGameHistory: null | G3HistoryPeace[];
    fifthGameHistory: null | G5HistoryPeace[];
    changableAssets: null | number;
    totalExpenses: null | number;
    crisisYearResult: null | Record<
        string,
        | number
        | string
        | string[]
        | boolean
        | Record<string, number>
        | BBSIncome[]
    >;
    showRules: boolean;
    reload: boolean;
    playerDistances: null | Record<string, number>;
    selectableInvestment: null | number;
    playerBuildings: IConstructionData;
    g4Data: G4Data;
    g6Data: G6Data;
}

const returnBFromKey: Record<string, string> = {
    businessOne: 'b1',
    businessTwo: 'b2',
    businessThree: 'b3',
    businessFour: 'b4',
    businessFive: 'b5',
};

const initialState: GameInfo = {
    activeGame: null,
    players: null,
    admin: null,
    playerInfo: null,
    joined: false,
    investments: {
        iv1: 0,
        iv2: 0,
        iv3: 0,
        iv4: 0,
        iv5: 0,
    },
    gameInvestments: null,
    bancrupcies: {
        b1: false,
        b2: false,
        b3: false,
        b4: false,
        b5: false,
    },
    businesses: null,
    returns: null,
    changableAssets: null,
    totalExpenses: null,
    crisisYearResult: null,
    showRules: false,
    reload: false,
    secondGameHistory: null,
    thirdGameHistory: null,
    fifthGameHistory: null,
    playerDistances: null,
    selectableInvestment: null,
    playerBuildings: {
        restaurant: false,
        conferenceHall: false,
        tennisCourt: false,
        swimmingPool: false,
    },
    g4Data: {
        machines: null,
        playerMachine: null,
        team: null,
        g4Investment: null,
        investmentReturns: null,
        playerTeam: null,
        teammateResult: null,
        teamMachines: null,
        teamResults: false,
        teams: null,
        g4InvestmentTest: null,
    },
    g6Data: {
        rulePage: 0,
        choosingBarberShop: false,
        barbershops: [],
        savedBarbershops: [],
        g6InvestmentPage: null,
        newBarbershop: {
            isNew: true,
            newEquipment: true,
            location: 'city',
            equipment: 'base',
            budget: 'mid',
            barber: {
                skill: 'base',
                isLearning: false,
            },
            clients: NaN,
            ownerWorking: true,
        },
        barbershopExpenses: 0,
        playerBarbershops: {},
        editing: false,
        playerSkill: {
            skill: 'base',
            isLearning: false,
        },
        prevIndex: null,
    },
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setActiveGame: (state, action) => {
            state.activeGame = action.payload;
        },
        startGameRdx: (state) => {
            if (!state.activeGame) {
                return state;
            }

            state = {
                ...state,
                activeGame: {
                    ...state.activeGame,
                    started: true,
                },
                showRules: true,
            };

            return state;
        },
        setPlayers: (state, action) => {
            state.players = action.payload;
        },
        playerLeave: (state, action) => {
            if (!state.players) {
                return state;
            }

            state.players = state.players.filter(
                (player) => player._id !== action.payload
            );
            state.players.filter((player) => player._id !== action.payload);
        },
        playerJoin: (state, action) => {
            const player: PlayerInterface = action.payload;

            if (!state.players) {
                state.players = [];
            }

            const alreadyIn = state.players.some((p) => p._id === player._id);
            if (!alreadyIn) {
                state.players = [...state.players, player];
            }
        },
        receiveInvestment: (state, action) => {
            const investment: InvestmentInterface = action.payload;

            if (
                !state.gameInvestments?.find((iv) => iv._id === investment._id)
            ) {
                let total_distance = 0;
                const investment_player = investment.player_id;
                const investment_amount = JSON.parse(investment.value)
                    ?.investments?.speed;

                if (state.playerDistances) {
                    total_distance = state.playerDistances[investment_player];
                }

                if (investment_amount) {
                    total_distance += investment_amount;
                }

                let newPlayerDistances = {
                    ...state.playerDistances,
                };

                newPlayerDistances[investment_player] = total_distance;

                state = {
                    ...state,
                    playerDistances: newPlayerDistances,
                };
            }

            if (!state.gameInvestments) {
                state.gameInvestments = [];
            }

            const alreadyIn = state.gameInvestments.some(
                (iv) => iv._id === investment._id
            );
            if (!alreadyIn) {
                state = {
                    ...state,
                    gameInvestments: [...state.gameInvestments, investment],
                };
            }

            return state;
        },
        setAdmin: (state, action) => {
            state.admin = action.payload;
        },
        resetGameState: () => initialState,
        setPlayerInfo: (state, action) => {
            const {
                player,
                playerInvestments,
            }: {
                player: PlayerInterface;
                playerInvestments: InvestmentInterface[];
            } = action.payload;
            if (!player || !playerInvestments) {
                return;
            }

            if (state.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi') {
                state = {
                    ...state,
                    playerInfo: player,
                    gameInvestments: playerInvestments,
                    changableAssets: 0,
                };
            } else {
                state = {
                    ...state,
                    playerInfo: player,
                    changableAssets: player.assets,
                    gameInvestments: playerInvestments,
                };
            }

            if (state.activeGame?.type === 'Ražošana') {
                if (player.teammates) {
                    const playerTeam = player.teammates.split(',');

                    state = {
                        ...state,
                        g4Data: {
                            ...state.g4Data,
                            team: playerTeam,
                        },
                    };
                }
            }

            return state;
        },
        joinGameRdx: (state) => {
            state = {
                ...state,
                joined: true,
            };

            return state;
        },
        switchYearRdx: (state, action) => {
            if (!state.activeGame) {
                return state;
            }

            let receivedYear = action.payload;

            if (!receivedYear) {
                receivedYear = null;
            }

            if (!receivedYear) {
                state = {
                    ...state,
                    activeGame: { ...state.activeGame, started: false },
                };

                return state;
            }

            state = {
                ...state,
                activeGame: { ...state.activeGame, year: action.payload },
            };

            return state;
        },
        changeInvestment: (
            state,
            action: { payload: InvestmentsInterface }
        ) => {
            if (
                !state.playerInfo ||
                state.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi'
            ) {
                return state;
            }

            // Atrodi totālo pieejamo sumu
            const availableAssets = state.playerInfo.assets;

            let unchangedAssetsTotal = 0;
            const changedAsets: Partial<InvestmentsInterface> = {};

            // Noskaidro kuras vērtības tiek mainītas:
            for (const investmentKey in action.payload) {
                const newInvestment =
                    action.payload[investmentKey as keyof InvestmentsInterface];
                const currentInvestment =
                    state.investments[
                        investmentKey as keyof InvestmentsInterface
                    ];

                if (newInvestment < 0) {
                    return state;
                }

                if (newInvestment === currentInvestment) {
                    unchangedAssetsTotal += newInvestment;
                } else {
                    changedAsets[investmentKey as keyof InvestmentsInterface] =
                        newInvestment;
                }
            }

            let leftOffAssets = Math.max(
                availableAssets - unchangedAssetsTotal,
                0
            );

            if (leftOffAssets === 0) {
                return state;
            }

            for (const investmentKey in changedAsets) {
                const changedAsset =
                    changedAsets[investmentKey as keyof InvestmentsInterface];

                if (typeof changedAsset === 'undefined') {
                    continue;
                }

                const intermidiet = leftOffAssets - changedAsset;

                changedAsets[investmentKey as keyof InvestmentsInterface] =
                    intermidiet < 0 ? leftOffAssets : changedAsset;

                leftOffAssets = Math.max(intermidiet, 0);
            }

            const updatedInvestment = {
                ...state.investments,
                ...changedAsets,
            };

            state = {
                ...state,
                investments: updatedInvestment,
                changableAssets: leftOffAssets,
            };

            return state;
        },
        removeAssets: (state, action) => {
            const { plus, minus } = action.payload;

            if (
                !state.changableAssets ||
                state.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi'
            ) {
                return state;
            }

            state.changableAssets = state.changableAssets - minus;
            state.changableAssets = state.changableAssets + plus;

            return state;
        },
        updatePlayerAssets: (state, action) => {
            const {
                assets,
                playerBancrupcies,
            }: {
                assets: Record<string, number>;
                playerBancrupcies: Record<string, boolean>;
                investmentReturns: Record<string, Record<string, any>>;
            } = action.payload;

            if (!state.players) {
                return state;
            }

            state.players.map((player) => {
                const playerAssets = assets[player._id];
                const is_bancrupt = playerBancrupcies[player._id];

                if (typeof playerAssets !== 'number') {
                    return player;
                }

                player.assets = playerAssets;
                player.is_bancrupt = is_bancrupt;

                return player;
            });

            return state;
        },
        pauseGameRdx: (state, action) => {
            const paused: boolean = action.payload;

            if (!state.activeGame) {
                return;
            }

            state.activeGame.paused = paused;
        },
        updateOwnAssets: (state, action) => {
            const {
                assets,
                playerId,
            }: {
                assets: Record<string, number>;
                playerId: string | undefined;
            } = action.payload;
            if (!playerId || !state.playerInfo) {
                return state;
            }

            const playerAssets = assets[playerId];
            if (typeof playerAssets !== 'number') {
                return state;
            }

            if (state.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi') {
                state = {
                    ...state,
                    playerInfo: {
                        ...state.playerInfo,
                        assets: playerAssets,
                    },
                };
            } else {
                state = {
                    ...state,
                    changableAssets: playerAssets,
                    playerInfo: {
                        ...state.playerInfo,
                        assets: playerAssets,
                    },
                };
            }

            if (!state.players) {
                return state;
            }

            state.players = state.players.map((player) => {
                const statePlayerAssets = assets[player._id];
                if (typeof statePlayerAssets !== 'number') {
                    return player;
                }

                return {
                    ...player,
                    assets: statePlayerAssets,
                };
            });

            return state;
        },
        handleBankrupcy: (state, action) => {
            const bancrupcies: Record<
                string,
                Record<string, any>
            > = action.payload;

            if (!state.activeGame) {
                return state;
            } else if (state.activeGame.type === 'Bankrots') {
                const bancrupcy1 = bancrupcies['businessOne'];
                const bancrupcy2 = bancrupcies['businessTwo'];
                const bancrupcy3 = bancrupcies['businessThree'];
                const bancrupcy4 = bancrupcies['businessFour'];
                const bancrupcy5 = bancrupcies['businessFive'];

                state.bancrupcies = {
                    b1: bancrupcy1.isBancrupt,
                    b2: bancrupcy2.isBancrupt,
                    b3: bancrupcy3.isBancrupt,
                    b4: bancrupcy4.isBancrupt,
                    b5: bancrupcy5.isBancrupt,
                };

                return state;
            } else if (state.activeGame.type === 'Ražošana') {
                if (!state.g4Data.machines) {
                    return state;
                }

                const newMachines = state.g4Data.machines.map((m) => {
                    const machineInfo = bancrupcies[m.number];
                    if (machineInfo) {
                        m = {
                            ...m,
                            owner: machineInfo.owner,
                        };

                        return m;
                    }

                    return m;
                });

                let playerMachine = null;

                if (state.playerInfo) {
                    playerMachine = newMachines.find(
                        (m) => m.owner === state.playerInfo?._id
                    );
                }

                if (playerMachine) {
                    state = {
                        ...state,
                        g4Data: {
                            ...state.g4Data,
                            playerMachine: playerMachine,
                        },
                    };
                }

                state = {
                    ...state,
                    g4Data: {
                        ...state.g4Data,
                        machines: newMachines,
                    },
                };

                return state;
            }

            return state;
        },
        changeSecondGameInvestment: (state, action) => {
            const ivVal = action.payload * -10;

            state = {
                ...state,
                investments: {
                    iv1: ivVal,
                    iv2: action.payload,
                    iv3: 0,
                    iv4: 0,
                    iv5: 0,
                },
            };

            return state;
        },
        setInvestments: (state, action) => {
            if (typeof action.payload.iv1 === 'number') {
                state = {
                    ...state,
                    investments: {
                        ...state.investments,
                        ...action.payload,
                    },
                };

                return state;
            }

            state = {
                ...state,
                gameInvestments: action.payload,
            };

            return state;
        },
        setBusinesses: (state, action) => {
            const businesses: BusinessInterface[] = action.payload;

            if (!state.businesses) {
                state.businesses = [];
            }

            state.businesses = businesses;

            businesses.forEach((business) => {
                if (business.is_bancrupt) {
                    switch (business.key) {
                        case 'businessOne':
                            return (state.bancrupcies = {
                                ...state.bancrupcies,
                                b1: true,
                            });
                        case 'businessTwo':
                            return (state.bancrupcies = {
                                ...state.bancrupcies,
                                b2: true,
                            });
                        case 'businessThree':
                            return (state.bancrupcies = {
                                ...state.bancrupcies,
                                b3: true,
                            });
                        case 'businessFour':
                            return (state.bancrupcies = {
                                ...state.bancrupcies,
                                b4: true,
                            });
                        case 'businessFive':
                            return (state.bancrupcies = {
                                ...state.bancrupcies,
                                b5: true,
                            });
                    }
                }
            });
        },
        setReturns: (state, action) => {
            const {
                bancrupcies,
                investmentReturns,
                investments,
            }: {
                bancrupcies: Record<string, Record<string, any>>;
                investmentReturns: Record<string, Record<string, any>>;
                investments: Record<string, Record<string, any>>;
            } = action.payload;

            if (!bancrupcies) {
                state.returns = null;
                return;
            }

            if (state.activeGame?.type === 'Frizētava') {
                return state;
            } else if (
                state.playerInfo &&
                state.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi'
            ) {
                const playerDistance =
                    investmentReturns[state.playerInfo._id]?.driveData.distance;
                if (playerDistance) {
                    state = {
                        ...state,
                        changableAssets: playerDistance,
                    };
                }
            } else if (
                state.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi'
            ) {
                const newResults: Record<string, number | boolean> = {
                    kmH60: bancrupcies['60'].isCaught,
                    kmH70: bancrupcies['70'].isCaught,
                    kmH80: bancrupcies['80'].isCaught,
                    kmH90: bancrupcies['90'].isCaught,
                    kmH100: bancrupcies['100'].isCaught,
                    kmH110: bancrupcies['110'].isCaught,
                    kmH120: bancrupcies['120'].isCaught,
                    kmH130: bancrupcies['130'].isCaught,
                };

                state = {
                    ...state,
                    crisisYearResult: {
                        ...state.crisisYearResult,
                        ...newResults,
                    },
                };
            } else if (state.activeGame?.type === 'Viesnīca') {
                if (state.playerInfo) {
                    const playerResults =
                        investmentReturns[state.playerInfo._id];
                    const hotelData = playerResults.hotelData;
                    const clientData = playerResults.clientData;

                    const playerInvestment = investments[state.playerInfo._id];

                    const { averagePrice, clients, price, weather, incomes } =
                        hotelData;

                    const { constructions } = playerInvestment;

                    const constructionExpenses =
                        getPriceFromBuilding(constructions);
                    const buildingType = translateBuilding(constructions);
                    const buildingTypeToU = getBuildingToU(buildingType);

                    const constructionInvestment = {
                        buildingType: buildingTypeToU,
                        buildingCost: constructionExpenses,
                    };

                    const {
                        clientBase,
                        conferenceHall,
                        priceDifference,
                        restaurant,
                        swimmingPool,
                        tennisCourt,
                    } = clientData;

                    state = {
                        ...state,
                        crisisYearResult: {
                            ...state.crisisYearResult,
                            page: 1,
                            averagePrice,
                            clients,
                            price,
                            ...weather,
                            ...incomes,
                            clientData,
                            ...constructionInvestment,
                        },
                    };
                } else {
                    let g5Result = null;

                    while (!g5Result) {
                        for (const returnKey in investmentReturns) {
                            const playerReturns = investmentReturns[returnKey];
                            const hotelData = playerReturns.hotelData;

                            const averagePrice = hotelData.averagePrice;

                            g5Result = {
                                averagePrice: averagePrice,
                                ...hotelData.weather,
                            };
                        }
                    }

                    state = {
                        ...state,
                        crisisYearResult: {
                            ...state.crisisYearResult,
                            ...g5Result,
                            page: 1,
                        },
                    };
                }
            }

            const newReturns: Record<
                string,
                {
                    returnRate: number;
                    returnAmount?: number;
                }
            > = {};

            if (!state.playerInfo || !investmentReturns) {
                for (const returnRateKey in bancrupcies) {
                    const returnKey = returnBFromKey[returnRateKey];

                    const returnRate = bancrupcies[returnRateKey];

                    newReturns[returnKey] = {
                        returnRate: returnRate.returnRate,
                        returnAmount: 0,
                    };
                }

                state = {
                    ...state,
                    returns: {
                        ...state.returns,
                        ...newReturns,
                    },
                };

                return state;
            }

            const playerReturns = investmentReturns[state.playerInfo._id];
            const playerInvestments = investments[state.playerInfo._id];

            if (
                state.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi' &&
                state.playerInfo &&
                playerReturns
            ) {
                const driveData = playerReturns.driveData;

                state = {
                    ...state,
                    crisisYearResult: {
                        ...state.returns,
                        ...driveData,
                        page: 1,
                    },
                };

                return state;
            }

            if (
                !state.activeGame ||
                !state.players ||
                !playerReturns ||
                !playerInvestments ||
                state.activeGame.type === 'Krīzes gads'
            ) {
                return;
            }

            for (const returnRateKey in bancrupcies) {
                const returnKey = returnBFromKey[returnRateKey];

                const returnRate = bancrupcies[returnRateKey];
                const returnAmount = playerReturns[returnRateKey];

                const businessInvestmentValue: number =
                    playerInvestments[returnRateKey];
                if (!returnAmount?.returnedAssets) {
                    continue;
                }

                const returnDiff =
                    returnAmount.returnedAssets - businessInvestmentValue;

                newReturns[returnKey] = {
                    returnRate: returnRate.returnRate,
                    returnAmount: returnDiff,
                };
            }

            state = {
                ...state,
                returns: {
                    ...state.returns,
                    ...newReturns,
                },
            };

            state = {
                ...state,
                investments: {
                    ...state.investments,
                    iv1: 0,
                    iv2: 0,
                    iv3: 0,
                    iv4: 0,
                    iv5: 0,
                },
            };

            return state;
        },
        setTotalExpenses: (state, action) => {
            if (state.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi') {
                state = {
                    ...state,
                    changableAssets: state.changableAssets + action.payload,
                };

                return state;
            } else if (state.activeGame?.type === 'Viesnīca') {
                if (!state.playerBuildings) {
                    return state;
                }

                let newPlayerBuildings: IConstructionData = {
                    ...state.playerBuildings,
                };
                if (!newPlayerBuildings) {
                    return state;
                }

                let building = String(action.payload);

                if (
                    building === 'restaurant' ||
                    building === 'conferenceHall' ||
                    building === 'tennisCourt' ||
                    building === 'swimmingPool'
                ) {
                    newPlayerBuildings[building] = true;
                } else {
                    return state;
                }

                state = {
                    ...state,
                    playerBuildings: {
                        ...state.playerBuildings,
                        ...newPlayerBuildings,
                    },
                };

                return state;
            }

            if (!state.activeGame || state.activeGame.type !== 'Krīzes gads') {
                return state;
            }

            if (typeof state.changableAssets !== 'number') {
                return state;
            }

            state = {
                ...state,
                totalExpenses: action.payload * -10,
                changableAssets: state.changableAssets + action.payload * -10,
            };

            return state;
        },
        setAllExpenses: (state, action) => {
            const data: {
                incomes: Record<string, any>;
                pigsOnMarket: number;
                crisisYear: boolean;
                investments: Record<string, Record<string, any>>;
                year: GameInterface['year'];
                investmentReturns: Record<string, Record<string, any>>;
                teams: string[][];
                bancrupcies: Record<string, Record<string, any>>;
            } = action.payload;

            const {
                incomes,
                pigsOnMarket,
                crisisYear,
                investments,
                year,
                investmentReturns,
                teams,
                bancrupcies,
            } = data;

            if (!incomes) {
                state.returns = null;
                return state;
            }

            if (!state.activeGame) {
                return state;
            }

            if (state.activeGame.type === 'Frizētava') {
                let touristAmount: string | null = null;
                let newPlayerBarbershops: Record<string, IBarbershop[]> = {};
                let newPlayerSkill: IPlayer = state.g6Data.playerSkill;

                for (const rtrnKey in investmentReturns) {
                    const playerBBss = investmentReturns[rtrnKey].barbershops;

                    newPlayerBarbershops[rtrnKey] = playerBBss;
                }

                if (state.playerInfo) {
                    touristAmount =
                        investmentReturns[state.playerInfo._id].touristAmount;

                    newPlayerSkill =
                        investmentReturns[state.playerInfo._id].player;
                } else {
                    while (!touristAmount) {
                        for (const returnKey in investmentReturns) {
                            touristAmount =
                                investmentReturns[returnKey].touristAmount;
                        }
                    }
                }

                let returnTAm = 'mazs';

                if (
                    touristAmount === 'min' ||
                    touristAmount === 'mid' ||
                    touristAmount === 'large'
                ) {
                    returnTAm = touristAmountFromEn[touristAmount];
                }

                state = {
                    ...state,
                    crisisYearResult: {
                        ...state.crisisYearResult,
                        touristAmount: returnTAm,
                    },
                    g6Data: {
                        ...state.g6Data,
                        playerBarbershops: newPlayerBarbershops,
                        playerSkill: newPlayerSkill,
                    },
                };

                if (state.playerInfo) {
                    const newBarbershops: IBarbershop[] =
                        investmentReturns[state.playerInfo._id].barbershops;

                    const userIncomes =
                        investmentReturns[state.playerInfo._id]?.incomes;
                    if (!userIncomes) {
                        return state;
                    }

                    const {
                        barbershopIncome,
                        bankPercentages,
                        initialAssets,
                        totalAssets,
                    } = userIncomes;

                    const bbsIncomes: BBSIncome[] = barbershopIncome;

                    let totalEquipmentCosts = 0;
                    let totalIncomesFromClients = 0;
                    let totalLabourCosts = 0;
                    let totalLearningCosts = 0;
                    let totalSalonCosts = 0;
                    let totalClients = 0;
                    let totalMarketingCosts = 0;
                    let totalIncomes = 0;
                    let totalSellCosts = 0;

                    newBarbershops.forEach((bbs) => {
                        totalClients += bbs.clients;
                    });

                    if (bbsIncomes) {
                        bbsIncomes.forEach((bbs) => {
                            const {
                                equipmentCosts,
                                incomesFromClients,
                                labourCosts,
                                learningCosts,
                                salonCosts,
                                sellCosts,
                                marketingCosts,
                            } = bbs;

                            totalEquipmentCosts += equipmentCosts;
                            totalIncomesFromClients += incomesFromClients;
                            totalLabourCosts += labourCosts;
                            totalLearningCosts += learningCosts;
                            totalSalonCosts += salonCosts;
                            totalMarketingCosts += marketingCosts;
                            totalSellCosts += sellCosts;
                        });
                    }

                    totalIncomes =
                        totalEquipmentCosts +
                        totalIncomesFromClients +
                        totalLabourCosts +
                        totalLearningCosts +
                        totalSellCosts +
                        totalMarketingCosts +
                        totalSalonCosts +
                        bankPercentages;

                    state = {
                        ...state,
                        g6Data: {
                            ...state.g6Data,
                            barbershops: newBarbershops,
                            savedBarbershops: newBarbershops,
                            playerSkill: newPlayerSkill,
                        },
                        crisisYearResult: {
                            ...state.crisisYearResult,
                            totalClients: totalClients,
                            barbershopReturns: bbsIncomes,
                            totalEquipmentCosts,
                            totalIncomes: totalIncomes,
                            totalIncomesFromClients,
                            totalMarketingCosts,
                            totalLabourCosts,
                            totalLearningCosts,
                            totalSalonCosts,
                            totalSellCosts,
                            bankPercentages,
                            page: 1,
                        },
                    };
                }

                return state;
            } else if (state.activeGame.type === 'Bankrots') {
                if (!state.playerInfo) {
                    return state;
                }

                const playerIncomes = incomes[state.playerInfo._id];
                if (!playerIncomes) {
                    return state;
                }

                const { totalIncome } = playerIncomes;

                state = {
                    ...state,
                    crisisYearResult: {
                        ...state.crisisYearResult,
                        totalIncome: totalIncome,
                    },
                };

                return state;
            } else if (state.activeGame.type === 'Viesnīca') {
                if (state.playerInfo) {
                    const playerInvestments = investments[state.playerInfo._id];
                    const playerReturns =
                        investmentReturns[state.playerInfo._id];

                    if (playerInvestments && playerReturns) {
                        const hotelData = playerReturns.hotelData;

                        const prevYear = prevGameYearString(
                            year
                        ) as G5HistoryPeace['year'];

                        const historyPeace: G5HistoryPeace = {
                            year: prevYear,
                            averagePrice: hotelData.averagePrice,
                            price: playerInvestments.price,
                            clients: hotelData.clients,
                        };

                        let historyHs = state.fifthGameHistory;

                        if (!state.fifthGameHistory) {
                            historyHs = [historyPeace];
                        } else if (typeof prevYear === 'string') {
                            historyHs = [
                                ...state.fifthGameHistory.filter(
                                    (hP) => hP.year !== historyPeace.year
                                ),
                                historyPeace,
                            ];
                        }

                        state = {
                            ...state,
                            fifthGameHistory: historyHs,
                        };
                    }

                    if (state.playerInfo) {
                        let newPlayerBuildings: IConstructionData = {
                            ...state.playerBuildings,
                        };

                        let building = String(
                            investments[state.playerInfo?._id]?.constructions
                        );

                        if (
                            building === 'restaurant' ||
                            building === 'conferenceHall' ||
                            building === 'tennisCourt' ||
                            building === 'swimmingPool'
                        ) {
                            newPlayerBuildings[building] = true;
                        }

                        state = {
                            ...state,
                            playerBuildings: {
                                ...state.playerBuildings,
                                ...newPlayerBuildings,
                            },
                        };
                    }
                }

                return state;
            } else if (
                state.activeGame.type === 'Lēnāk brauksi - tālāk tiksi' &&
                state.playerInfo
            ) {
                const playerInvestments = investments[state.playerInfo._id];
                const playerReturns = investmentReturns[state.playerInfo._id];

                if (playerInvestments && playerReturns) {
                    const driveData = playerReturns.driveData;
                    const penaltyTotal =
                        driveData.speedingFine + driveData.sleepingFine;

                    const prevYear = prevGameYearString(
                        year
                    ) as G3HistoryPeace['hour'];

                    const historyPeace: G3HistoryPeace = {
                        hour: prevYear,
                        speed: playerInvestments.speed,
                        penalty: penaltyTotal,
                    };

                    let historyHs = state.thirdGameHistory;

                    if (!state.thirdGameHistory) {
                        historyHs = [historyPeace];
                    } else if (
                        typeof prevYear === 'string' &&
                        state.thirdGameHistory.some(
                            (hP) => hP.hour !== historyPeace.hour
                        )
                    ) {
                        historyHs = [
                            ...state.thirdGameHistory.filter(
                                (hP) => hP.hour !== historyPeace.hour
                            ),
                            historyPeace,
                        ];
                    }

                    state = {
                        ...state,
                        secondGameHistory: [],
                        thirdGameHistory: historyHs,
                        fifthGameHistory: [],
                    };

                    return state;
                }
            } else if (state.activeGame.type === 'Ražošana') {
                let biggestIv = 0;
                let winningPlayer: null | string = null;
                let playerTeam: string[] = [];
                let newMachines: MachineInterface[] = [];

                for (const investmentKey in investments) {
                    const investmentAmount = investments[investmentKey].bet;

                    if (investmentAmount > biggestIv) {
                        biggestIv = investmentAmount;
                        winningPlayer = investmentKey;
                    }
                }

                if (state.g4Data.machines) {
                    newMachines = state.g4Data.machines.map((machine) => {
                        const machineData = bancrupcies[machine.number];
                        if (!machineData) {
                            return machine;
                        }

                        if (machineData.owner === winningPlayer) {
                            machine = {
                                ...machine,
                                soldFor: machineData.soldFor,
                            };
                        }

                        return machine;
                    });
                }

                teams &&
                    teams.forEach((team) => {
                        team.forEach((teammate) => {
                            if (teammate === state.playerInfo?._id) {
                                playerTeam = [...team];
                            }
                        });
                    });

                let newPlayers = state.players
                    ? state.players?.map((player) => {
                          let thisTeam: string[] = [];

                          teams &&
                              teams.forEach((team) => {
                                  team.forEach((teammate) => {
                                      if (teammate === player._id) {
                                          thisTeam = [...team];
                                      }
                                  });
                              });

                          player = {
                              ...player,
                              teammates: thisTeam.toString(),
                          };

                          return player;
                      })
                    : null;

                if (teams.length >= 3 && year) {
                    state = {
                        ...state,
                        showRules: true,
                        g6Data: {
                            ...state.g6Data,
                            rulePage: 1,
                        },
                    };

                    if (!state.playerInfo) {
                        state = {
                            ...state,
                            g6Data: {
                                ...state.g6Data,
                                rulePage: 2,
                            },
                        };
                    }
                }

                state = {
                    ...state,
                    crisisYearResult: {
                        team: playerTeam,
                        biggestIv: biggestIv,
                        playerWon: winningPlayer === state.playerInfo?._id,
                        page: 1,
                    },
                    g4Data: {
                        ...state.g4Data,
                        team: playerTeam,
                        machines: newMachines,
                        teams: teams,
                    },
                    players: newPlayers,
                };

                if (state.playerInfo) {
                    state = {
                        ...state,
                        playerInfo: {
                            ...state.playerInfo,
                            teammates: playerTeam.toString(),
                        },
                    };
                }
            } else if (state.activeGame.type === 'Krīzes gads') {
                const prevYear = prevGameYearString(
                    year
                ) as HistoryPeace['year'];

                const historyPeace: HistoryPeace = {
                    year: prevYear,
                    pigs: pigsOnMarket,
                };

                let historyHs = null;

                if (!state.secondGameHistory) {
                    historyHs = [historyPeace];
                } else if (
                    typeof prevYear === 'string' &&
                    state.secondGameHistory.some(
                        (hP) => hP.year !== historyPeace.year
                    )
                ) {
                    historyHs = [
                        ...state.secondGameHistory.filter(
                            (hP) => hP.year !== historyPeace.year
                        ),
                        historyPeace,
                    ];
                }

                if (!state.playerInfo) {
                    state = {
                        ...state,
                        secondGameHistory: historyHs,
                        crisisYearResult: {
                            ...state.crisisYearResult,
                            pigsOnMarket: pigsOnMarket,
                            crisisYear: crisisYear,
                            page: 1,
                        },
                    };

                    return state;
                }

                const playerIncomes = incomes[state.playerInfo._id];
                if (!playerIncomes) {
                    return state;
                }

                const {
                    bankExpenses,
                    familyExpenses,
                    pigsExpenses,
                    pigsIncomes,
                    totalIncome,
                } = playerIncomes;

                if (
                    (!bankExpenses && bankExpenses !== 0) ||
                    (!familyExpenses && familyExpenses !== 0) ||
                    (!pigsExpenses && pigsExpenses !== 0) ||
                    (!pigsIncomes && pigsIncomes !== 0) ||
                    (!totalIncome && totalIncome !== 0)
                ) {
                    state = {
                        ...state,
                        secondGameHistory: historyHs,
                    };

                    return state;
                }

                const playerInvestments = investments[state.playerInfo._id];
                if (!playerInvestments) {
                    state = {
                        ...state,
                        secondGameHistory: historyHs,
                    };

                    return state;
                }

                state = {
                    ...state,
                    secondGameHistory: historyHs,
                    crisisYearResult: {
                        ...state.crisisYearResult,
                        bankExpenses: bankExpenses,
                        familyExpenses: familyExpenses,
                        pigsExpenses: pigsExpenses,
                        pigsIncomes: pigsIncomes,
                        totalIncome: totalIncome,
                        playerPigs: playerInvestments.pigs,
                        pigsOnMarket: pigsOnMarket,
                        crisisYear: crisisYear,
                        page: 1,
                    },
                };
            }

            return state;
        },
        switchCrisisShowcasePage: (state, action) => {
            const page = action.payload;
            if (!state.crisisYearResult) {
                return state;
            }

            if (!page) {
                state = {
                    ...state,
                    crisisYearResult: null,
                    returns: null,
                };

                return state;
            }

            let maxPage = 3;

            if (state.activeGame?.type === 'Ražošana') {
                maxPage = 4;
            }

            if (page >= maxPage) {
                state = {
                    ...state,
                    crisisYearResult: null,
                    returns: null,
                };

                return state;
            }

            state = {
                ...state,
                crisisYearResult: {
                    ...state.crisisYearResult,
                    page: page,
                },
            };

            return state;
        },
        handlePlayerBancrupcies: (state, action) => {
            const playerBancrupcies: Record<string, boolean> = action.payload;

            if (!state.playerInfo) {
                return state;
            }

            const playerBancrupt = playerBancrupcies[state.playerInfo._id];
            if (typeof playerBancrupt !== 'boolean') {
                return state;
            }

            let newPlayers: PlayerInterface[] = [];

            state.players?.forEach((player) => {
                const new_player = {
                    ...player,
                    is_bancrupt: playerBancrupcies[player._id],
                };

                newPlayers = [...newPlayers, new_player];
            });

            state = {
                ...state,
                playerInfo: {
                    ...state.playerInfo,
                    is_bancrupt: playerBancrupt,
                },
                players: newPlayers,
            };

            return state;
        },
        handleRules: (state, action) => {
            const rulesOpen = action.payload;

            if (
                state.activeGame?.type === 'Frizētava' &&
                !rulesOpen &&
                state.g6Data.rulePage === 0
            ) {
                state = {
                    ...state,
                    g6Data: {
                        ...state.g6Data,
                        rulePage: 1,
                    },
                };

                return state;
            } else if (
                state.activeGame?.type === 'Frizētava' &&
                state.g6Data.rulePage === 1
            ) {
                state = {
                    ...state,
                    g6Data: {
                        ...state.g6Data,
                        rulePage: 0,
                    },
                };
            }

            if (state.activeGame?.started) {
                if (
                    state.activeGame?.type === 'Ražošana' &&
                    state.g6Data.rulePage === 0
                ) {
                    if (
                        state.g4Data.machines?.filter((m) => m.owner === null)
                            .length === 0
                    ) {
                        state = {
                            ...state,
                            g6Data: {
                                ...state.g6Data,
                                rulePage: 1,
                            },
                            showRules: true,
                        };
                        return state;
                    }
                } else if (
                    state.activeGame?.type === 'Ražošana' &&
                    state.g6Data.rulePage === 1
                ) {
                    state = {
                        ...state,
                        g6Data: {
                            ...state.g6Data,
                            rulePage: 2,
                        },
                    };

                    return state;
                } else if (
                    state.activeGame?.type === 'Ražošana' &&
                    state.g6Data.rulePage === 2
                ) {
                    state = {
                        ...state,
                        g6Data: {
                            ...state.g6Data,
                            rulePage: 0,
                        },
                        showRules: false,
                    };

                    return state;
                }
            }

            state = {
                ...state,
                showRules: rulesOpen,
            };

            return state;
        },
        handleReload: (state, action) => {
            state = {
                ...state,
                reload: action.payload,
            };

            return state;
        },
        updateInvestments: (state, action) => {
            state = {
                ...state,
                investments: {
                    ...state.investments,
                    ...action.payload,
                },
            };

            return state;
        },
        handleHistoryData: (state, action) => {
            const historyData: IPlayerReport = action.payload;

            if (state.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi') {
                const currentDistance =
                    historyData.yearlyData[historyData.yearlyData.length - 1]
                        .driveData?.distance;
                if (!currentDistance) {
                    return state;
                }

                let historyHs: G3HistoryPeace[] = [];

                historyData.yearlyData.forEach((yD) => {
                    const year = yD.yearKey;
                    const speed = yD.driveData?.speed;
                    const sleepingFine = Number(yD.driveData?.sleepingFine);
                    const speedingFine = Number(yD.driveData?.speedingFine);
                    const penalty = sleepingFine + speedingFine;

                    const historyPeace: G3HistoryPeace = {
                        hour: year,
                        speed: Number(speed),
                        penalty: penalty,
                    };

                    historyHs = [...historyHs, historyPeace];
                });

                state = {
                    ...state,
                    changableAssets: currentDistance,
                    thirdGameHistory: historyHs,
                };

                return state;
            } else if (state.activeGame?.type === 'Viesnīca') {
                let historyHs: G5HistoryPeace[] = [];

                historyData.yearlyData.forEach((yD) => {
                    const year = yD.yearKey;
                    const price = yD.hotelData?.price;
                    const averagePrice = yD.hotelData?.averagePrice;
                    const clients = yD.hotelData?.clients;

                    const historyPeace: G5HistoryPeace = {
                        year: year,
                        price: Number(price),
                        averagePrice: Number(averagePrice),
                        clients: Number(clients),
                    };

                    historyHs = [...historyHs, historyPeace];
                });

                state = {
                    ...state,
                    fifthGameHistory: historyHs,
                };

                return state;
            } else if (state.activeGame?.type === 'Frizētava') {
                if (historyData.yearlyData.length === 0) {
                    return state;
                }

                const activeData =
                    historyData.yearlyData[historyData.yearlyData.length - 1];

                if (!activeData.barberData || !state.playerInfo) {
                    return state;
                }

                const { barbershops, incomes, player } = activeData.barberData;

                const playerAssets = incomes?.totalAssets;

                if (player) {
                    state = {
                        ...state,
                        g6Data: {
                            ...state.g6Data,
                            playerSkill: player,
                        },
                    };
                }

                if (barbershops) {
                    state = {
                        ...state,
                        g6Data: {
                            ...state.g6Data,
                            barbershops: barbershops,
                            savedBarbershops: barbershops,
                        },
                        changableAssets: playerAssets,
                    };
                }

                if (
                    state.playerInfo &&
                    state.playerInfo.assets !== playerAssets
                ) {
                    state = {
                        ...state,
                        playerInfo: {
                            ...state.playerInfo,
                            assets: playerAssets,
                        },
                        changableAssets: playerAssets,
                    };
                }

                return state;
            } else if (state.activeGame?.type === 'Krīzes gads') {
                let history: HistoryPeace[] = [];

                historyData.yearlyData.forEach((yD) => {
                    const pigs = yD.pigsData?.pigsOnMarket;
                    const year = yD.yearKey;

                    if (typeof pigs !== 'number') {
                        return;
                    }

                    const historyPeace: HistoryPeace = {
                        year,
                        pigs,
                    };

                    history = [...history, historyPeace];
                });

                state = {
                    ...state,
                    secondGameHistory: history,
                };
            }

            return state;
        },
        showLeaderboard: (state) => {
            if (!state.activeGame) {
                return state;
            }

            state = {
                ...state,
                activeGame: {
                    ...state.activeGame,
                    started: false,
                },
            };

            return state;
        },
        setPlayerDistances: (state, action) => {
            const {
                yearResult,
                playerReport,
            }: {
                yearResult: IYearResult | null;
                playerReport: IPlayerReport[] | null;
            } = action.payload;

            if (Number(playerReport?.length) >= 1) {
                let newPlayerBarbershops: Record<string, IBarbershop[]> = {};

                if (state.activeGame?.type === 'Frizētava') {
                    playerReport?.forEach((report) => {
                        const hData =
                            report.yearlyData[report.yearlyData.length - 1];

                        const playerBBss = hData.barberData?.barbershops;

                        if (playerBBss) {
                            newPlayerBarbershops[hData.playerKey] = playerBBss;
                        }
                    });
                }

                state = {
                    ...state,
                    g6Data: {
                        ...state.g6Data,
                        playerBarbershops: newPlayerBarbershops,
                    },
                };

                return state;
            }

            if (state.activeGame?.type !== 'Lēnāk brauksi - tālāk tiksi') {
                return state;
            }

            let newPlayerDistances: Record<string, number> = {};

            if (yearResult) {
                if (yearResult.investmentReturns) {
                    state.players?.forEach((player) => {
                        const new_distance =
                            yearResult.investmentReturns[player._id]?.driveData
                                ?.distance;

                        if (new_distance) {
                            newPlayerDistances[player._id] = new_distance;
                        }
                    });
                }
            } else if (playerReport && playerReport.length >= 0) {
                playerReport.forEach((report) => {
                    const report_player = report.playerKey;

                    let player_distance =
                        report.yearlyData[report.yearlyData.length - 1]
                            .driveData?.distance;

                    if (player_distance) {
                        newPlayerDistances[report_player] = player_distance;
                    }
                });
            }

            if (state.playerInfo) {
                const playerDistance = newPlayerDistances[state.playerInfo._id];
                if (!playerDistance) {
                    state = {
                        ...state,
                        playerDistances: newPlayerDistances,
                    };

                    return state;
                }

                state = {
                    ...state,
                    playerDistances: newPlayerDistances,
                    changableAssets: playerDistance,
                };
            } else {
                state = {
                    ...state,
                    playerDistances: newPlayerDistances,
                };
            }

            return state;
        },
        setPlayerBuildings: (state, action) => {
            const { yearlyData }: IPlayerReport = action.payload;

            if (!state.activeGame) {
                return state;
            }

            const prevYear = prevGameYearString(state.activeGame.year);

            const thisYearData = yearlyData.find(
                (yD) => yD.yearKey === prevYear
            );
            if (!thisYearData || !thisYearData.hotelData) {
                return state;
            }

            state = {
                ...state,
                playerBuildings: {
                    ...thisYearData.hotelData.constructions,
                },
            };

            return state;
        },
        setSelectableInvestment: (state, action) => {
            const { investment }: { investment: number | null } =
                action.payload;
            if (
                state.activeGame?.type === 'Krīzes gads' &&
                typeof investment === 'number'
            ) {
                const ivVal = investment * -10;

                state = {
                    ...state,
                    investments: {
                        ...state.investments,
                        iv1: ivVal,
                    },
                };
            } else if (
                state.activeGame?.type === 'Viesnīca' &&
                typeof investment === 'number'
            ) {
                if (state.investments.iv1 === 0) {
                    state = {
                        ...state,
                        selectableInvestment: investment,
                    };

                    return state;
                } else {
                    state = {
                        ...state,
                        investments: {
                            ...state.investments,
                            iv2: investment,
                        },
                    };
                }
            }
            if (typeof investment === 'number') {
                state = {
                    ...state,
                    investments: {
                        ...state.investments,
                        iv2: investment,
                    },
                };
            }

            if (state.activeGame?.type === 'Viesnīca' && !investment) {
                state = {
                    ...state,
                    investments: {
                        ...state.investments,
                        iv1: 0,
                        iv2: 0,
                    },
                };
            }

            state = {
                ...state,
                selectableInvestment: investment,
            };

            return state;
        },
        setG4Investment: (state, action) => {
            state = {
                ...state,
                g4Data: {
                    ...state.g4Data,
                    g4Investment: action.payload,
                },
            };

            return state;
        },
        setG4InvestmentTest: (state, action) => {
            state = {
                ...state,
                g4Data: {
                    ...state.g4Data,
                    g4InvestmentTest: action.payload,
                },
            };

            return state;
        },
        calculateG4InvestmentReturns: (state, action) => {
            state = {
                ...state,
                g4Data: {
                    ...state.g4Data,
                    investmentReturns: action.payload,
                },
            };

            return state;
        },
        setActiveMachines: (state, action) => {
            const receivedMachines: MachineInterface[] = action.payload;

            state = {
                ...state,
                g4Data: {
                    ...state.g4Data,
                    machines: receivedMachines,
                },
            };

            if (state.playerInfo) {
                const playerMachine = receivedMachines.find(
                    (m) => m.owner === state.playerInfo?._id
                );

                if (playerMachine) {
                    state = {
                        ...state,
                        g4Data: {
                            ...state.g4Data,
                            playerMachine: playerMachine,
                        },
                    };
                }
            }

            return state;
        },
        setPlayerTeam: (state, action) => {
            state = {
                ...state,
                g4Data: {
                    ...state.g4Data,
                    playerTeam: action.payload,
                },
            };

            return state;
        },
        setTeammateResult: (state, action) => {
            state = {
                ...state,
                g4Data: {
                    ...state.g4Data,
                    teammateResult: action.payload,
                },
            };

            return state;
        },
        setTeamMachinesRdx: (state, action) => {
            state = {
                ...state,
                g4Data: {
                    ...state.g4Data,
                    teamMachines: action.payload,
                },
            };

            return state;
        },
        switchActiveResults: (state, action) => {
            state = {
                ...state,
                g4Data: {
                    ...state.g4Data,
                    teamResults: action.payload,
                },
            };

            return state;
        },
        setTeams: (state, action) => {
            state = {
                ...state,
                g4Data: {
                    ...state.g4Data,
                    teams: action.payload,
                },
            };

            return state;
        },
        handleBarbershopChoice: (state, action) => {
            state = {
                ...state,
                g6Data: {
                    ...state.g6Data,
                    choosingBarberShop: action.payload,
                },
            };

            return state;
        },
        setPlayerBarbershops: (state, action) => {
            state = {
                ...state,
                g6Data: {
                    ...state.g6Data,
                    barbershops: action.payload,
                },
            };

            return state;
        },
        handleG6InvestmentPage: (state, action) => {
            const payload: null | 'ok' = action.payload;

            if (!payload || state.g6Data.g6InvestmentPage === 1) {
                if (payload && state.g6Data.g6InvestmentPage === 1) {
                    const { total, assets } = getBarbershopExpenses(
                        state.playerInfo?.assets,
                        state.g6Data.barbershops,
                        state.g6Data.newBarbershop,
                        state.g6Data.playerSkill,
                        state.g6Data.savedBarbershops,
                        state.g6Data.prevIndex
                    );

                    state = {
                        ...state,
                        g6Data: {
                            ...state.g6Data,
                            barbershopExpenses: total,
                            prevIndex: null,
                        },
                        changableAssets: assets,
                    };

                    state = {
                        ...state,
                        g6Data: {
                            ...state.g6Data,
                            barbershops: [
                                ...state.g6Data.barbershops,
                                state.g6Data.newBarbershop,
                            ],
                            editing: false,
                            newBarbershop: initialState.g6Data.newBarbershop,
                        },
                    };
                } else if (!payload) {
                    state = {
                        ...state,
                        g6Data: {
                            ...state.g6Data,
                            newBarbershop: initialState.g6Data.newBarbershop,
                        },
                        changableAssets: Number(state.playerInfo?.assets),
                    };
                }

                state = {
                    ...state,
                    g6Data: {
                        ...state.g6Data,
                        g6InvestmentPage: null,
                        choosingBarberShop: false,
                    },
                };

                return state;
            }

            state = {
                ...state,
                g6Data: {
                    ...state.g6Data,
                    g6InvestmentPage: Number(state.g6Data.g6InvestmentPage) + 1,
                },
            };

            return state;
        },
        updateNewBarbershop: (state, action) => {
            const payload: {
                location: 'centrs' | 'perifērija';
                budget: 1 | 2 | 3;
                level: 1 | 2 | 3;
                skill: 1 | 2 | 3;
                isLearning: boolean;
                ownerWorking: boolean;
            } = action.payload;

            const { location, budget, level, skill, ownerWorking, isLearning } =
                payload;

            const loc = locFromLV[location];

            if (loc === 'city' || loc === 'country') {
                state = {
                    ...state,
                    g6Data: {
                        ...state.g6Data,
                        newBarbershop: {
                            ...state.g6Data.newBarbershop,
                            location: loc,
                        },
                    },
                };
            }

            const newBudget = budgetFromStars[budget];
            state = {
                ...state,
                g6Data: {
                    ...state.g6Data,
                    newBarbershop: {
                        ...state.g6Data.newBarbershop,
                        budget: newBudget,
                    },
                },
            };
            let prevBarbershopVersion: IBarbershop | null = null;

            if (
                typeof state.g6Data.prevIndex === 'number' &&
                state.g6Data.savedBarbershops.length >=
                    state.g6Data.prevIndex + 1
            ) {
                prevBarbershopVersion =
                    state.g6Data.savedBarbershops[state.g6Data.prevIndex];
            }

            const newSkill = skillFromStars[skill];
            const newLevel = skillFromStars[level];

            let newWorker: IBarber = {
                ...state.g6Data.newBarbershop.barber,
                skill: newSkill,
                isLearning: isLearning,
            };

            if (
                ownerWorking &&
                skill < starsFromSkill[state.g6Data.playerSkill.skill]
            ) {
                newWorker = { ...state.g6Data.playerSkill };
            } else if (!ownerWorking) {
                newWorker = {
                    ...state.g6Data.newBarbershop.barber,
                    skill: newSkill,
                    isLearning: false,
                };
            }

            if (ownerWorking) {
                state = {
                    ...state,
                    g6Data: {
                        ...state.g6Data,
                        playerSkill: {
                            ...state.g6Data.playerSkill,
                            ...newWorker,
                        },
                    },
                };
            } else {
                state = {
                    ...state,
                    g6Data: {
                        ...state.g6Data,
                        newBarbershop: {
                            ...state.g6Data.newBarbershop,
                            barber: {
                                ...state.g6Data.newBarbershop.barber,
                                ...newWorker,
                            },
                        },
                    },
                };
            }

            state = {
                ...state,
                g6Data: {
                    ...state.g6Data,
                    newBarbershop: {
                        ...state.g6Data.newBarbershop,
                        ownerWorking: ownerWorking,
                        equipment: newLevel,
                    },
                },
            };

            let newEquipment = false;

            if (!state.g6Data.newBarbershop.isNew) {
                if (!prevBarbershopVersion) {
                    newEquipment = true;
                } else if (
                    prevBarbershopVersion.equipment !==
                    state.g6Data.newBarbershop.equipment
                ) {
                    newEquipment = true;
                }
            } else {
                newEquipment = true;
            }

            state = {
                ...state,
                g6Data: {
                    ...state.g6Data,
                    newBarbershop: {
                        ...state.g6Data.newBarbershop,
                        newEquipment: newEquipment,
                    },
                },
            };

            const { total, assets } = getBarbershopExpenses(
                state.playerInfo?.assets,
                state.g6Data.barbershops,
                state.g6Data.newBarbershop,
                state.g6Data.playerSkill,
                state.g6Data.savedBarbershops,
                state.g6Data.prevIndex
            );

            state = {
                ...state,
                g6Data: {
                    ...state.g6Data,
                    barbershopExpenses: total,
                },
            };

            return state;
        },
        editBarbershop: (state, action) => {
            const index: number | null = action.payload;

            if (typeof index !== 'number') {
                const { total, assets } = getBarbershopExpenses(
                    state.playerInfo?.assets,
                    state.g6Data.barbershops,
                    state.g6Data.newBarbershop,
                    state.g6Data.playerSkill,
                    state.g6Data.savedBarbershops,
                    state.g6Data.prevIndex
                );

                if (typeof state.g6Data.prevIndex === 'number') {
                    const newBBss = [...state.g6Data.barbershops].splice(
                        state.g6Data.prevIndex,
                        0,
                        state.g6Data.newBarbershop
                    );

                    state = {
                        ...state,
                        g6Data: {
                            ...state.g6Data,
                            barbershops: newBBss,
                            newBarbershop: initialState.g6Data.newBarbershop,
                            g6InvestmentPage: 0,
                            choosingBarberShop: false,
                            editing: false,
                            barbershopExpenses: total,
                            prevIndex: null,
                        },
                        changableAssets: assets,
                    };
                }

                return state;
            }

            const newBarbershop: IBarbershop = state.g6Data.barbershops[index];

            const newBarbershops = state.g6Data.barbershops.filter(
                (_bbs, i) => i !== index
            );

            state = {
                ...state,
                g6Data: {
                    ...state.g6Data,
                    barbershops: newBarbershops,
                    newBarbershop: newBarbershop,
                    g6InvestmentPage: 0,
                    choosingBarberShop: true,
                    editing: true,
                    prevIndex: index,
                },
            };

            const { total, assets } = getBarbershopExpenses(
                state.playerInfo?.assets,
                state.g6Data.barbershops,
                state.g6Data.newBarbershop,
                state.g6Data.playerSkill,
                state.g6Data.savedBarbershops,
                state.g6Data.prevIndex
            );

            state = {
                ...state,
                g6Data: {
                    ...state.g6Data,
                    barbershopExpenses: total,
                },
            };

            return state;
        },
    },
});

export const {
    setActiveGame,
    setPlayers,
    playerLeave,
    playerJoin,
    setAdmin,
    startGameRdx,
    resetGameState,
    setPlayerInfo,
    joinGameRdx,
    removeAssets,
    changeInvestment,
    receiveInvestment,
    switchYearRdx,
    updateOwnAssets,
    updatePlayerAssets,
    handleBankrupcy,
    setInvestments,
    setBusinesses,
    handleRules,
    setReturns,
    pauseGameRdx,
    changeSecondGameInvestment,
    setTotalExpenses,
    setAllExpenses,
    switchCrisisShowcasePage,
    handlePlayerBancrupcies,
    handleReload,
    updateInvestments,
    handleHistoryData,
    showLeaderboard,
    setPlayerDistances,
    setPlayerBuildings,
    setSelectableInvestment,
    setActiveMachines,
    setG4Investment,
    calculateG4InvestmentReturns,
    setPlayerTeam,
    setTeammateResult,
    setTeamMachinesRdx,
    switchActiveResults,
    setTeams,
    handleBarbershopChoice,
    setPlayerBarbershops,
    handleG6InvestmentPage,
    updateNewBarbershop,
    editBarbershop,
    setG4InvestmentTest,
} = gameSlice.actions;

export const selectGame = (state: any) => state.game;

export default gameSlice.reducer;
