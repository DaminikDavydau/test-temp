import { Dispatch } from 'redux';
import { setNotification } from '../redux/slices/notificationSlice';

export const verifyG4Investment = (
    teamwork: Record<string, null | boolean>,
    nowork: Record<string, null | boolean>,
    machineData: Record<
        string,
        {
            firstMachine: boolean;
            secondMachine: boolean;
        }
    >,
    playerShares: Record<
        string,
        {
            firstPlayer: number;
            secondPlayer: number;
        }
    >,
    dispatch: Dispatch
) => {
    for (const tmwrkKey in teamwork) {
        const sus = teamwork[tmwrkKey];
        if (sus === null) {
            return false;
        }
    }

    for (const noWorkKey in nowork) {
        const sus = nowork[noWorkKey];
        if (sus === null) {
            return false;
        }
    }

    for (const shareKey in playerShares) {
        const sus = playerShares[shareKey];
        const noWorking = nowork[shareKey];
        if (!noWorking && (sus.firstPlayer <= 0 || sus.secondPlayer <= 0)) {
            dispatch(
                setNotification({
                    type: 'error',
                    message: 'Jūsu daļa nevar būt 0%',
                })
            );
            
            return false;
        }
    }

    return true;
};
