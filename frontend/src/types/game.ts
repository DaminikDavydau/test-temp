export interface GameInterface {
    _id: string;
    code: string;
    admin: string;
    started: boolean;
    paused: boolean;
    type:
        | 'Bankrots'
        | 'Krīzes gads'
        | 'Lēnāk brauksi - tālāk tiksi'
        | 'Viesnīca'
        | 'Frizētava'
        | 'Ražošana';
    year:
        | 'yearOne'
        | 'yearTwo'
        | 'yearThree'
        | 'yearFour'
        | 'yearFive'
        | 'yearSix'
        | 'yearSeven'
        | 'yearEight'
        | 'yearNine'
        | 'yearTen'
        | 'yearEleven'
        | 'yearTwelve'
        | 'yearThirteen'
        | 'yearFourteen'
        | 'yearFifteen'
        | 'yearSixteen'
        | 'yearSeventeen'
        | 'yearEighteen'
        | 'yearNineteen';
    players: string[];
    createdAt: string;
    updatedAt: string;
}
