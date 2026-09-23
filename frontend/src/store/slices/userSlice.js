import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/competitionApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const REGISTRY_KEY = 'feedants_registered_users';

// Helper to get local accounts registry
const getLocalRegistry = async () => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const data = window.localStorage.getItem(REGISTRY_KEY);
      return data ? JSON.parse(data) : {};
    }
    const data = await AsyncStorage.getItem(REGISTRY_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

// Helper to save account into registry
const saveToLocalRegistry = async (username, password, name) => {
  try {
    const registry = await getLocalRegistry();
    registry[username.toLowerCase()] = { username, password, name };
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
    } else {
      await AsyncStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
    }
  } catch (e) {}
};

export const signupUser = createAsyncThunk(
  'user/signup',
  async ({ username, password, name }, { rejectWithValue }) => {
    const cleanUsername = username.trim().toLowerCase();

    // Check local registry first
    const registry = await getLocalRegistry();
    if (registry[cleanUsername]) {
      return rejectWithValue('Username already taken. Please choose another or log in.');
    }

    try {
      const data = await api.signup({ username: cleanUsername, password, name });
      await saveToLocalRegistry(cleanUsername, password, name || cleanUsername);
      return data.user;
    } catch (error) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      // If server unreachable, save to local registry
      await saveToLocalRegistry(cleanUsername, password, name || cleanUsername);
      return {
        id: 'usr_' + Date.now(),
        username: cleanUsername,
        name: name || cleanUsername,
      };
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ username, password }, { rejectWithValue }) => {
    const cleanUsername = username.trim().toLowerCase();

    try {
      const data = await api.login({ username: cleanUsername, password });
      return data.user;
    } catch (error) {
      // If backend explicitly rejected (e.g. 404 or 401)
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }

      // Check local accounts registry
      const registry = await getLocalRegistry();
      const account = registry[cleanUsername];

      if (!account) {
        return rejectWithValue('Account does not exist. Please register first.');
      }

      if (account.password !== password) {
        return rejectWithValue('Incorrect password.');
      }

      return {
        id: 'usr_' + Date.now(),
        username: account.username,
        name: account.name,
      };
    }
  }
);

export const checkUserRegistration = createAsyncThunk(
  'user/checkRegistration',
  async (compId, { rejectWithValue }) => {
    try {
      const data = await api.checkRegistration(compId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check registration');
    }
  }
);

export const fetchUserSubmission = createAsyncThunk(
  'user/fetchSubmission',
  async (compId, { rejectWithValue }) => {
    try {
      const data = await api.getSubmission(compId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submission');
    }
  }
);

export const submitUserEntry = createAsyncThunk(
  'user/submitEntry',
  async ({ compId, formData, onProgress }, { rejectWithValue }) => {
    try {
      const data = await api.submitEntry(compId, formData, onProgress);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Submission failed');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registration: null,
  submission: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.registration = null;
      state.submission = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(checkUserRegistration.fulfilled, (state, action) => {
        state.registration = action.payload;
      })
      .addCase(fetchUserSubmission.fulfilled, (state, action) => {
        state.submission = action.payload;
      })
      .addCase(submitUserEntry.fulfilled, (state, action) => {
        state.submission = action.payload;
      });
  },
});

export const { setUser, clearUser, clearError } = userSlice.actions;
export default userSlice.reducer;
