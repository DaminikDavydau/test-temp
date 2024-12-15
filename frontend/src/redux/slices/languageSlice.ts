import { createSlice } from '@reduxjs/toolkit';
import { LangObj, Language } from '../../types/language';
import { lngVal } from '../../test/languageTypes';

export interface LanguageInfo {
    language: any;
    languages: null | LangObj[];
    activeLanguage: string;
}

const initialState: LanguageInfo = {
    language: lngVal,
    languages: null,
    activeLanguage: 'lv',
};

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state, action) => {
            return {
                ...state,
                language: action.payload,
            };
        },
        setActiveLanguage: (state, action) => {
            return {
                ...state,
                activeLanguage: action.payload,
            };
        },
        setLanguages: (state, action) => {
            return {
                ...state,
                languages: action.payload,
            };
        },
        addLanguage: (state, action) => {
            if (
                state.languages?.some(
                    (lng) => lng.language_id === action.payload.language_id
                )
            ) {
                return state;
            }

            return {
                ...state,
                languages: state.languages
                    ? [...state.languages, action.payload]
                    : [action.payload],
            };
        },
        deleteLanguageRdx: (state, action) => {
            return {
                ...state,
                languages: state.languages
                    ? state.languages.filter(
                          (lng) => lng._id !== action.payload
                      )
                    : null,
            };
        },
    },
});

export const {
    setLanguage,
    setLanguages,
    addLanguage,
    setActiveLanguage,
    deleteLanguageRdx,
} = languageSlice.actions;

export const selectLanguage = (state: any) => state.language;

export default languageSlice.reducer;
