export class BusinessBase {
    isBancrupt: boolean;
    bancrupcyYear: string;

    constructor(isBancrupt: boolean, bancrupcyYear: string) {
        this.isBancrupt = isBancrupt;
        this.bancrupcyYear = bancrupcyYear;
    }
}
