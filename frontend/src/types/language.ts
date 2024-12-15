export interface Language {
    'home-screen': {
        'create-game': string;
        home: string;
        'back-home': string;
        'enter-code': string;
        'join-game': string;
        privacy: string;
        'data-protection': string;
        login: string;
    };
    'login-screen': {
        'login-title': string;
        email: string;
        password: string;
        'forgot-password': string;
        'login-btn': string;
        register: string;
        'register-screen': {
            'full-name': string;
            privacy: string;
        };
        'reset-screen': {
            'reset-title': string;
            prompt: string;
            submit: string;
        };
    };
    'create-game-screen': {
        'create-game-title': string;
        'choose-game': string;
        'create-game-btn': string;
        'game-names': string[];
    };
    'join-game-screen': {
        name: string;
        surname: string;
        'join-game': string;
    };
    'generic-game-screen': {
        name: string;
        you: string;
        players: string;
        'game-owner': string;
        'start-game': string;
        'stop-game': string;
        'soon-begin': string;
        'please-wait': string;
        'end-turn': string;
        'submit-turn': string;
        'next-year': string;
        'current-year': string;
        'you-bankrupt': string;
        'get-results': string;
        'exit-game': string;
        'finish-game': string;
        'save-results': string;
        'results-title': string;
        summary: string;
        ok: string;
        continue: string;
        'please-wait-end-year': string;
        'finish-game-dialogue': {
            title: string;
            text: string;
            yes: string;
            no: string;
        };
    };
    'g1-screens': {
        'investment-return-title': string;
        'market-situation': string;
        return: string;
        'bankrupcy-probability': string;
        'business-names': string[];
    };
    'g2-screens': {
        'pig-price-title': string;
        'total-pig-amount': string;
        'good-year-title': string;
        'bad-year-title': string;
        'history year': string;
        'pig-expenses': string;
        'history-placeholder': string;
        'history-title': string;
        'pig-admount': string;
        'amount-owned': string;
        'pig-value': string;
        'year-was': string;
        good: string;
        bad: string;
        'review-screen': {
            title: string;
            'pigs-bought': string;
            'family-expenses': string;
            'bank-percentages': string;
            'pigs-sold': string;
            'pig-price': string;
            incomes: string;
            expenses: string;
            'money-before': string;
            'money-after': string;
            revenue: string;
        };
    };
    'g3-screens': {
        'current-hour': string;
        'please-wait-end-hours': string;
        'change-hour': string;
        'distance-made': string;
        'distance-left': string;
        probability: string;
        'history year': string;
        'history-placeholder': string;
        'history-title': string;
        'info-screen': {
            'players-caught-title': string;
            'not-caught': string;
            caught: string;
            'caught-alert': string;
            'not-slept-alert': string;
            fines: string;
            speed1: string;
            speed2: string;
            hour: string;
            'fine-probability': string;
            fine: string;
            'fine-not-sleeping-title': string;
            'fine-not-sleeping-value': string;
            bonuses: string;
            arrival: string;
            first: string;
            'saved-money': string;
        };
        'review-screen': {
            title: string;
            'fine-expenses': string;
            'saved-time-bonus': string;
            'first-bonus': string;
            'finished-income': string;
            'total-income': string;
        };
    };
}

export interface LangObj {
    _id: string;
    language_id: string;
}
