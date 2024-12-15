export interface MachineInterface {
    _id: string;
    game_id: string;
    type: '1' | '2' | '3' | '4' | '5' | '6';
    number: string;
    owner: string | null;
    soldFor: number | null;
    timesUsed: number;
    createdAt: string;
    updatedAt: string;
}
