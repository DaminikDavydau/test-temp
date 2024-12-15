import { Dispatch } from 'redux';
import { connect, getSocket } from '../redux/slices/socketSlice';
import { InvestmentInterface } from '../types/investment';

const sendInvestment = (
    investment: InvestmentInterface,
    adminId: string | string[],
    dispatch: Dispatch
) => {
    const socket = getSocket();
    if (!socket) {
        dispatch(connect());
    }

    socket.emit('sendInvestment', { adminId: adminId, investment: investment });
};
export { sendInvestment };
