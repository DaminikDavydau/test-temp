import { GameInterface } from '../logic/game/interfaces';

export const generateGameKey = (games: GameInterface[]) => {
    let reload = false;
    let restart = true;

    let code = '';

    while (restart) {
        let codeChars: number[] = [];

        while(codeChars.length < 6){
            let codeChar = Math.floor(Math.random() * (1 + 8));

            codeChars = [...codeChars, codeChar];
        }

        codeChars.forEach((char) => {
            code = String(`${code}${char}`);
        });

        games.forEach((game) => {
            if (String(game.code) === code) {
                reload = false;
            }
        });

        reload = true;

        if (!reload) {
            restart = true;
        } else {
            restart = false;
        }
    }

    return code;
};
