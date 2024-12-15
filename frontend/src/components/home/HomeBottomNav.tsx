import React from 'react';
import Link from 'next/link';
import { selectUser, UserInfo } from '../../redux/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../redux/slices/gameSlice';
import { deleteGame } from '../../requests/gameRequests';
import { useRouter } from 'next/router';
import { logoutUser } from '../../requests/userRequests';

interface Props {
    link1: string;
    path1: string;
    link2: string;
    path2: string;
}

const HomeBottomNav: React.FC<Props> = ({ link1, path1, link2, path2 }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const userInfo: UserInfo = useSelector(selectUser);
    const gameInfo: GameInfo = useSelector(selectGame);

    const logout = () => {
        logoutUser(dispatch);
    };

    if (router.asPath === '/profile' && userInfo.info) {
        return (
            <div className="flex items-center justify-center absolute bottom-24 left-0 w-full">
                <div className="flex items-center justify-center">
                    <p className="cursor-pointer" onClick={() => logout()}>
                        {link1}
                    </p>
                </div>
            </div>
        );
    }

    if (
        gameInfo.activeGame &&
        userInfo.info &&
        gameInfo.activeGame.admin === userInfo.info._id
    ) {
        return (
            <div className="flex items-center justify-center absolute bottom-16 left-0 w-full">
                <div className="flex items-center justify-center">
                    <p
                        className="cursor-pointer"
                        onClick={() => deleteGame(dispatch, router)}
                    >
                        {link2}
                    </p>
                </div>
            </div>
        );
    }

    if (userInfo.loggedIn) {
        return (
            <div className="flex items-center justify-center absolute bottom-24 left-0 w-full">
                <div className="flex items-center justify-center">
                    <Link href={path2}>
                        <p className="cursor-pointer">{link2}</p>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center absolute bottom-24 left-0 w-full">
            <div className="flex items-center justify-center">
                <Link href={path1}>
                    <p className="cursor-pointer">{link1}</p>
                </Link>

                <p className="mx-6">|</p>

                <Link href={path2}>
                    <p className="cursor-pointer">{link2}</p>
                </Link>
            </div>
        </div>
    );
};

export default HomeBottomNav;
