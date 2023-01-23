import { configureStore } from '@reduxjs/toolkit';
import yhteystiedotReducer from './yhteystiedotSlice';

export const store = configureStore({
    reducer : {
        yhteystiedot : yhteystiedotReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;