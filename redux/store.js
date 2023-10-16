import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import { createWrapper } from 'next-redux-wrapper';
import gameReducer from './slices/gameSlice';

const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      game: gameReducer,
    },
  });

export const wrapper = createWrapper(makeStore);
