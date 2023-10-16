import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async ({ limit, offset, status }, { getState }) => {
    try {
      const { token } = getState().user;
      if (!token) {
        throw new Error('Token not found');
      }

      let url = `https://tictactoe.aboutdream.io/games?limit=${limit}&offset=${offset}`;

      if (status !== 'All') {
        url += `&status=${status.toLowerCase()}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error in fetchGames:', error);
      throw error;
    }
  }
);

export const createGame = createAsyncThunk(
  'game/create',
  async (_, { getState }) => {
    try {
      const { token } = getState().user;
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await axios.post(
        'https://tictactoe.aboutdream.io/games/',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error in creategame:', error);
      throw error;
    }
  }
);

export const fetchGameDetails = createAsyncThunk(
  'games/fetchGameDetails',
  async (id, { getState }) => {
    try {
      const { token } = getState().user;
      if (!token) {
        throw new Error('Token not found');
      }

      const url = `https://tictactoe.aboutdream.io/games/${id}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error in fetchgame:', error);
      throw error;
    }
  }
);
export const joinGame = createAsyncThunk(
  'games/joinGame',
  async (id, { getState }) => {
    try {
      const { token } = getState().user;
      if (!token) {
        console.error('Token not found');
        throw new Error('Token not found');
      }
      const url = `https://tictactoe.aboutdream.io/games/${id}/join/`;
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('API response in joinGame:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in joinGame:', error);
      throw error;
    }
  }
);

export const makeMove = createAsyncThunk(
  'games/makeMove',
  async ({ id, row, col }, { getState }) => {
    try {
      const { token } = getState().user;
      if (!token) {
        throw new Error('Token not found');
      }

      const url = `https://tictactoe.aboutdream.io/games/${id}/move/`;
      const response = await axios.post(
        url,
        { row, col },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error in makeMove:', error);
      throw error;
    }
  }
);

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    games: [],
    error: null,
    pagination: {
      limit: 10,
      offset: 0,
    },
    filter: 'All',
    currentGame: null,
    makeMoveError: null,
    joinGameError: null,
  },
  reducers: {
    setGames: (state, action) => {
      state.games = action.payload;
    },
    setGamePagination: (state, action) => {
      state.pagination = action.payload;
    },
    setGameFilter: (state, action) => {
      state.filter = action.payload;
    },
    setCurrentGame: (state, action) => {
      state.currentGame = action.payload;
    },
    setMakeMoveError: (state, action) => {
      state.makeMoveError = action.payload;
    },
    setJoinGameError: (state, action) => {
      state.joinGameError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.games = action.payload.results;
        state.error = null;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.currentGame = action.payload;
        state.error = null;
      })
      .addCase(createGame.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchGameDetails.fulfilled, (state, action) => {
        state.currentGame = action.payload;
        state.error = null;
      })
      .addCase(fetchGameDetails.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(joinGame.fulfilled, (state, action) => {
        state.currentGame = action.payload;
        state.error = null;
      })
      .addCase(joinGame.rejected, (state, action) => {
        state.joinGameError = action.error.message;
        if (action.error) {
          if (action.error.message.includes('403')) {
            if (state.currentGame && state.currentGame.status === 'progress') {
              state.error =
                "You can't join a game that is already in progress.";
            } else {
              state.error = 'This game is not joinable.';
            }
          } else {
            state.error = action.error.message || 'An unknown error occurred';
          }
        }
      })
      .addCase(makeMove.fulfilled, (state, action) => {
        state.currentGame = action.payload;
        state.error = null;
      })
      .addCase(makeMove.rejected, (state, action) => {
        state.makeMoveError = action.error.message;

        if (action.error) {
          if (action.error.message.includes('403')) {
            if (state.currentGame && state.currentGame.status !== 'progress') {
              state.error =
                "You can't make a move in a finished or unstarted game.";
            } else {
              state.error = 'Invalid move.';
            }
          } else {
            state.error = action.error.message || 'An unknown error occurred';
          }
        }
      });
  },
});

export const { setGames, setGamePagination, setGameFilter, setCurrentGame } =
  gameSlice.actions;

export default gameSlice.reducer;
