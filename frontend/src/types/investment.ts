import { GameInterface } from "./game";

export interface InvestmentInterface {
    _id: string;
    game_id: string;
    player_id: string;
    year: GameInterface["year"];
    value: string;
    createdAt: string;
    updatedAt: string;
}