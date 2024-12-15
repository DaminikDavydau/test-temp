export interface InvestmentInterface {
    _id: string;
    game_id: string;
    player_id: string;
    year: string;
    value: string; //{ "businessOne": 100, "businessTwo": 900 } 
    createdAt: string;
    updatedAt: string;
}
