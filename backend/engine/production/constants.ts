import settings from './settings.json';

export const YEARS_KEYS = settings.yearKeys;
export const BUSINESS_KEYS = [];
export const MACHINE_TYPES = settings.machineSettings.types;
export const INITIAL_ASSETS = settings.playerSettings.initialAssets;

export const POWER_DIFFERENCE = settings.machineSettings.powerDifference;
export const TIMES_USED_BASE = settings.machineSettings.timesUsedBase;

export const POSITIVE_ASSETS = settings.playerSettings.positiveAssets;
export const NEGATIVE_ASSETS = settings.playerSettings.negativeAssets;

export const MINIMAL_PRICES = settings.machineSettings.minimalPrices;
export const MAX_BET = settings.machineSettings.maxBet;

export const PRODUCTION_YEARS = settings.productionYears