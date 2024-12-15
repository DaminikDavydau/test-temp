export interface BusinessInterface {
    _id: string;
    game_id: string;
    type: string;
    number: boolean;
    owner: string;
    timesUsed: number;
    soldFor: number | null;
    createdAt: string;
    updatedAt: string;
}
