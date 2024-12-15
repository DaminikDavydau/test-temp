import { EQUIPMENT_STORING } from '../constants/G6Constants';
import { IBarbershop, IPlayer } from '../types/barber';

const barbershopTotal = (
    bbs: IBarbershop,
    playerSkill: IPlayer,
    prevBarbershopVersion: IBarbershop | null,
    edit: boolean
) => {
    let total = 0;

    if (!bbs.isNew) {
        if (bbs.budget === 'mini') {
            total += 1000;
        } else if (bbs.budget === 'mid') {
            total += 1600;
        } else {
            total += 2000;
        }

        if (bbs.newEquipment) {
            if (bbs.equipment === 'base') {
                total += 2000;
            } else if (bbs.equipment === 'mid') {
                total += 3000;
            } else {
                total += 4000;
            }
        } else {
            total += EQUIPMENT_STORING[bbs.equipment];
        }

        if (bbs.ownerWorking) {
            if (playerSkill.isLearning && playerSkill.skill === 'base') {
                total += 2000;
            } else if (playerSkill.isLearning && playerSkill.skill === 'mid') {
                total += 4000;
            }
        } else {
            if (bbs.barber.skill === 'base') {
                total += 3000;
            } else if (bbs.barber.skill === 'mid') {
                total += 5000;
            }else if (bbs.barber.skill === 'pro') {
                total += 7000;
            }
        }

        return total;
    }

    if (bbs.isNew && prevBarbershopVersion && edit) {
        if (bbs.budget === 'mini') {
            if (prevBarbershopVersion?.budget === 'mid') {
                total -= 600;
            } else if (prevBarbershopVersion?.budget === 'large') {
                total -= 2000;
            }
        } else if (bbs.budget === 'mid') {
            if (prevBarbershopVersion?.budget === 'mini') {
                total += 600;
            } else if (prevBarbershopVersion?.budget === 'large') {
                total -= 400;
            }
        } else {
            if (prevBarbershopVersion?.budget === 'mini') {
                total += 1000;
            } else if (prevBarbershopVersion?.budget === 'mid') {
                total += 600;
            }
        }

        if (bbs.equipment === 'base') {
            if (prevBarbershopVersion?.equipment === 'mid') {
                total -= 1000;
            } else if (prevBarbershopVersion?.equipment === 'pro') {
                total -= 2000;
            }
        } else if (bbs.equipment === 'mid') {
            if (prevBarbershopVersion?.equipment === 'base') {
                total += 1000;
            } else if (prevBarbershopVersion?.equipment === 'pro') {
                total -= 1000;
            }
        } else {
            if (prevBarbershopVersion?.equipment === 'base') {
                total += 2000;
            } else if (prevBarbershopVersion?.equipment === 'mid') {
                total += 1000;
            }
        }

        if (bbs.ownerWorking) {
            if (playerSkill.isLearning && playerSkill.skill === 'base') {
                total += 2000;
            } else if (playerSkill.isLearning && playerSkill.skill === 'mid') {
                total += 4000;
            }
        } else {
            if (bbs.barber.skill === 'base') {
                if (prevBarbershopVersion?.barber.skill === 'mid') {
                    total -= 2000;
                } else if (prevBarbershopVersion?.barber.skill === 'pro') {
                    total -= 4000;
                }
            } else if (bbs.barber.skill === 'mid') {
                if (prevBarbershopVersion?.barber.skill === 'base') {
                    total += 2000;
                } else if (prevBarbershopVersion?.barber.skill === 'pro') {
                    total -= 2000;
                }
            } else {
                if (prevBarbershopVersion?.barber.skill === 'base') {
                    total += 4000;
                } else if (prevBarbershopVersion?.barber.skill === 'mid') {
                    total += 2000;
                }
            }
        }

        return total;
    }

    if (bbs.location === 'city') {
        total += 45000;
    } else {
        total += 30000;
    }

    if (bbs.budget === 'mini') {
        total += 1000;
    } else if (bbs.budget === 'mid') {
        total += 1600;
    } else {
        total += 2000;
    }

    if (bbs.equipment === 'base') {
        total += 2000;
    } else if (bbs.equipment === 'mid') {
        total += 3000;
    } else {
        total += 4000;
    }

    if (bbs.ownerWorking) {
        if (playerSkill.isLearning && playerSkill.skill === 'base') {
            total += 2000;
        } else if (playerSkill.isLearning && playerSkill.skill === 'mid') {
            total += 4000;
        }
    } else {
        if (bbs.barber.skill === 'base') {
            total += 3000;
        }else if (bbs.barber.skill === 'mid') {
            total += 5000;
        } else if (bbs.barber.skill === 'pro') {
            total += 7000;
        }
    }

    return total;
};

export const getBarbershopExpenses = (
    assets: number | null | undefined,
    barbershops: IBarbershop[],
    barberShop: IBarbershop,
    playerSkill: IPlayer,
    savedBarbershops: IBarbershop[],
    prevBbsIndex: number | null
) => {
    let prevBarbershopVersion: IBarbershop | null = null;

    if (
        typeof prevBbsIndex === 'number' &&
        savedBarbershops.length >= prevBbsIndex + 1
    ) {
        prevBarbershopVersion = savedBarbershops[prevBbsIndex];
    }

    let total = 0;

    barbershops.forEach((bbs) => {
        const bbsTotal = barbershopTotal(
            bbs,
            playerSkill,
            prevBarbershopVersion,
            false
        );
        total += bbsTotal;
    });

    const bbsTotal = barbershopTotal(
        barberShop,
        playerSkill,
        prevBarbershopVersion,
        true
    );
    total += bbsTotal;

    assets = Number(assets) - total;

    return { total, assets };
};
