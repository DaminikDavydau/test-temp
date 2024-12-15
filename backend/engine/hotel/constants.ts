import settings from './settings.json';

export const YEARS_KEYS = settings.yearKeys;
export const BUSINESSES_KEYS = [];
export const INITIAL_ASSETS = settings.playerSettings.initialAssets;
export const CLEAR_SKY_NUMBERS = settings.weatherSettings.clearSkyNumbers;
export const CLEAR_WATER_NUMBERS = settings.weatherSettings.clearWaterNumbers;
export const CLIENT_AMOUNT = settings.weatherSettings.clientAmount;
export const CLIENT_CHANGE = settings.priceSettings.clientChange;
export const CLIENT_MULTIPLIER = settings.constructionSettings.clientMultiplier;
export const ALLOWED_CONSTRUCTIONS =
    settings.constructionSettings.allowedConstructions;
export const CONSTRUCTION_PRICES =
    settings.constructionSettings.constructionPrices;
export const ALLOWED_PRICES = settings.priceSettings.allowedPrices;
export const POOL_FINE = settings.weatherSettings.poolFine;
export const NEGATIVE_ASSETS_PERCENTAGES = settings.bankSettings.negativeAssets;
export const POSITIVE_ASSETS_PERCENTAGES = settings.bankSettings.positiveAssets;
export const AUTO_PRICE = settings.priceSettings.autoPrice;
