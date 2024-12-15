export function getRandomResult(probabilities: number[], results: any[]): any {
    const num = Math.random(),
        lastIndex = probabilities.length - 1;
    let s = 0;

    for (let i = 0; i < lastIndex; ++i) {
        s += probabilities[i];
        if (num < s) {
            return results[i];
        }
    }

    return results[lastIndex];
};

export function getRandomTrueFalse(trueProbability: number): boolean {
    const probabilities = [trueProbability, 1 - trueProbability];
    const results = [true, false];

    const result = getRandomResult(probabilities, results);
    return result;
};
