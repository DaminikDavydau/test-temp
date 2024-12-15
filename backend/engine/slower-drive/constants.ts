import settings from './settings.json';

export const YEARS_KEYS = settings.yearKeys;
export const BUSINESSES_KEYS = [];
export const INITIAL_ASSETS = settings.playerSettings.initialAssets;
export const GOAL_DISTANCE = settings.playerSettings.goalDistance;
export const SLEEPING_INTERVAL = settings.playerSettings.sleepingInterval;
export const SPEEDING_FINE_RATE = settings.fineSettings.speedingFineRate;
export const SLEEPING_FINE = settings.fineSettings.sleepingFine;
export const DEFAULT_SPEED = settings.playerSettings.defaultSpeed;
export const REWARD_MARGIN_YEAR = settings.playerSettings.rewardMarginYear;
export const FINISHED_FIRST_REWARD =
    settings.rewardSettings.finishedFirstReward;
export const IS_EARLY_REWARD = settings.rewardSettings.isEarlyReward;
export const FINISHED_REWARD = settings.rewardSettings.finishedReward;
export const CATCH_PROBABILITY = settings.policeSettings.catchProbability;
export const ALLOWED_INVESTMENRS = settings.playerSettings.allowedInvestments;
export const AUTO_SPEED = settings.playerSettings.autoSpeed;
