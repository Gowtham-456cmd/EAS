import { createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';
import { ATTENDANCE_ENDPOINTS, MANAGER_ATTENDANCE_ENDPOINTS, buildEndpoint } from '../../utils/apiEndpoints';

const initialState = {
  todayStatus: null,
  history: [],
  summary: null,
  allAttendance: [],
  teamSummary: null,
  todayStatusAll: null,
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setTodayStatus: (state, action) => {
      state.todayStatus = action.payload;
      state.loading = false;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
      state.loading = false;
    },
    setSummary: (state, action) => {
      state.summary = action.payload;
      state.loading = false;
    },
    setAllAttendance: (state, action) => {
      state.allAttendance = action.payload;
      state.loading = false;
    },
    setTeamSummary: (state, action) => {
      state.teamSummary = action.payload;
      state.loading = false;
    },
    setTodayStatusAll: (state, action) => {
      state.todayStatusAll = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setTodayStatus,
  setHistory,
  setSummary,
  setAllAttendance,
  setTeamSummary,
  setTodayStatusAll,
  setError,
  clearError,
} = attendanceSlice.actions;

export const checkIn = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    await api.post(ATTENDANCE_ENDPOINTS.CHECK_IN);
    dispatch(fetchTodayStatus());
    return { success: true };
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Check-in failed'));
    return { success: false };
  }
};

export const checkOut = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    await api.post(ATTENDANCE_ENDPOINTS.CHECK_OUT);
    dispatch(fetchTodayStatus());
    return { success: true };
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Check-out failed'));
    return { success: false };
  }
};

export const fetchTodayStatus = () => async (dispatch) => {
  try {
    const response = await api.get(ATTENDANCE_ENDPOINTS.TODAY_STATUS);
    dispatch(setTodayStatus(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch status'));
  }
};

export const fetchHistory = (month, year) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    const response = await api.get(buildEndpoint(ATTENDANCE_ENDPOINTS.MY_HISTORY, params));
    dispatch(setHistory(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch history'));
  }
};

export const fetchSummary = (month, year) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    const response = await api.get(buildEndpoint(ATTENDANCE_ENDPOINTS.MY_SUMMARY, params));
    dispatch(setSummary(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch summary'));
  }
};

export const fetchAllAttendance = (filters) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await api.get(buildEndpoint(MANAGER_ATTENDANCE_ENDPOINTS.ALL_ATTENDANCE, filters));
    dispatch(setAllAttendance(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch attendance'));
  }
};

export const fetchTeamSummary = (month, year) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    const response = await api.get(buildEndpoint(MANAGER_ATTENDANCE_ENDPOINTS.TEAM_SUMMARY, params));
    dispatch(setTeamSummary(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch team summary'));
  }
};

export const fetchTodayStatusAll = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await api.get(MANAGER_ATTENDANCE_ENDPOINTS.TODAY_STATUS_ALL);
    dispatch(setTodayStatusAll(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch today status'));
  }
};

export default attendanceSlice.reducer;

