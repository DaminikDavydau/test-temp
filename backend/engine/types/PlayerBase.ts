export class PlayerBase {
    public static bancrupcyMargin: number = 0;

    public assets: number;

    constructor(assets: number) {
        this.assets = assets;
    }

    public isBancrupt(): boolean {
        throw Error('Not implemented yet.');
    }
}
