import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ username, password }) => {
    try {
      const response = await axios.post(
        'https://tictactoe.aboutdream.io/register/',
        { username, password }
      );
      return response.data;
    } catch (error) {
      console.error('Error in registerUser:', error);
      throw error;
    }
  }
);

export const fetchRankings = createAsyncThunk(
  'rankings/fetchRankings',
  async (_, { getState }) => {
    try {
      const { token, pagination } = getState().user;
      const { limit, offset } = pagination;

      if (!token) {
        throw new Error('Token not found');
      }
      const response = await axios.get(
        `https://tictactoe.aboutdream.io/users?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error in fetchRankings:', error);
      throw error;
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ username, password }) => {
    try {
      const response = await axios.post(
        'https://tictactoe.aboutdream.io/login/',
        { username, password }
      );
      return response.data;
    } catch (error) {
      console.error('Error in loginuser:', error);
      throw error;
    }
  }
);

export const initializeState = createAsyncThunk(
  'user/initializeState',
  async (_, { dispatch }) => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token) {
          axios.defaults.headers['Authorization'] = `Bearer ${token}`;
          return { isAuthenticated: true, token, username };
        }
      }
      return {};
    } catch (error) {
      console.error('Error in initializeState:', error);
      throw error;
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    username: null,
    error: null,
    token: null,
    pagination: {
      limit: 10,
      offset: 0,
    },
    rankings: [],
  },
  reducers: {
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    loginFailed: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      localStorage.removeItem('token');
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        if (action.error.message) {
          state.error =
            'One symbol/letter is required for Username and Password.';
        }
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.username = action.payload.username;
        state.token = action.payload.token;
        state.error = null;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('username', action.payload.username);

        axios.defaults.headers[
          'Authorization'
        ] = `Bearer ${action.payload.token}`;
      })
      .addCase(loginUser.rejected, (state, action) => {
        if (action.error.message) {
          state.error = 'Login failed, please try again.';
        }
      })
      .addCase(initializeState.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.token = action.payload.token;
        state.username = action.payload.username;
      })
      .addCase(fetchRankings.fulfilled, (state, action) => {
        state.rankings = action.payload;
        state.error = null;
      })
      .addCase(fetchRankings.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { setPagination, loginFailed, logout } = userSlice.actions;

export default userSlice.reducer;
