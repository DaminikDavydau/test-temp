export function getOrdinal(n: number | string | null, language: string): string {
    if (!n) {
        return '';
    }
    if (language === 'en') {
    const num = Number(n);
    const s = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (s[(v - 20) % 10] || s[v] || s[0]);
    }
    else if (language === 'lv') {
        const num = Number(n);
        return num + '.';
    }
    else {
        return Number(n) + '';
    }
}