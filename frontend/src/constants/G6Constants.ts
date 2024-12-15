export const budgetFromStars: Record<
    '1' | '2' | '3',
    'mini' | 'mid' | 'large'
> = {
    '1': 'mini',
    '2': 'mid',
    '3': 'large',
};

export const skillFromStars: Record<'1' | '2' | '3', 'base' | 'mid' | 'pro'> = {
    '1': 'base',
    '2': 'mid',
    '3': 'pro',
};

export const locFromLV = {
    centrs: 'city',
    perifērija: 'country',
};

export const starsFromSkill: Record<'pro' | 'mid' | 'base', number> = {
    pro: 3,
    mid: 2,
    base: 1,
};

export const starsFromBudget = {
    mini: 1,
    mid: 2,
    large: 3,
};

export const touristAmountFromEn = {
    min: 'mazs',
    large: 'liels',
    mid: 'vidējs',
};

export const MAX_BARBERSHOPS = 6;

export const EQUIPMENT_STORING: Record<
    'base' | 'mid' | 'pro',
    300 | 500 | 1000
> = {
    base: 300,
    mid: 500,
    pro: 1000,
};
