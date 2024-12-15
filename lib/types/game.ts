export interface GameInterface {
    _id: string;
    code: string;
    admin: string;
    started: boolean;
    paused: boolean;
    type: string;
    year: "yearOne" | "yearTwo" | "yearThree" | "yearFour" | "yearFive";
    players: string[];
    createdAt: string;
    updatedAt: string;
}
