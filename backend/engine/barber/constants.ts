import settings from './settings.json';

export const YEARS_KEYS = settings.yearKeys;
export const BUSINESSES_KEYS = [];
export const INITIAL_ASSETS = settings.playerSettings.initialAssets;
export const CLIENT_AMOUNT = settings.clientSettings.amount;
export const CLIENT_MULTIPLIERS = settings.clientSettings.multiplier;
export const PRICES = settings.priceSettings;
export const BANK_INTERESTS = settings.interestRate;
export const MAINTAIN_PRICE = settings.expensesSettings.maintainPrice;
export const BUY_PRICE = settings.expensesSettings.buyPrice;
export const LEARN_PRICE = settings.expensesSettings.learnPrice;
export const LABOUR_PRICE = settings.expensesSettings.labourPrice;
export const SALON_PRICE = settings.expensesSettings.salonPrice;
export const SELL_PRICE = settings.expensesSettings.sellPrice;
export const MARKETING_PRICE = settings.expensesSettings.marketingPrice;
export const BASE_CLIENT_AMOUNT = settings.clientSettings.baseAmount;
