import { createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';
import { AUTH_ENDPOINTS } from '../../utils/apiEndpoints';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setLoading, setUser, setError, logout, clearError } = authSlice.actions;

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
    dispatch(setUser({ user: response.data, token: response.data.token }));
    return { success: true };
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Registration failed'));
    return { success: false };
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
    dispatch(setUser({ user: response.data, token: response.data.token }));
    return { success: true };
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Login failed'));
    return { success: false };
  }
};

export const getMe = () => async (dispatch) => {
  try {
    const response = await api.get(AUTH_ENDPOINTS.GET_ME);
    dispatch(setUser({ user: response.data, token: localStorage.getItem('token') }));
  } catch (error) {
    dispatch(logout());
  }
};

export default authSlice.reducer;

