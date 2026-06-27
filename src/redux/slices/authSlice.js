import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  login as loginApi,
  logout as logoutApi,
  fetchAdminProfile,
  subscribeAuth,
  isAdminRole,
} from '@/firebase/authService';
import { DEFAULT_ROLE_PERMISSIONS } from '@/utils/permissions';
import { SESSION_TIMEOUT_MS } from '@/utils/constants';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const result = await loginApi(email, password, rememberMe);
      return result;
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  },
);

export const loadProfile = createAsyncThunk('auth/loadProfile', async (uid) => {
  const profile = await fetchAdminProfile(uid);
  return profile;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    profile: null,
    permissions: null,
    loading: true,
    error: null,
    lastActivity: Date.now(),
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setProfile(state, action) {
      state.profile = action.payload;
      const role = action.payload?.role;
      state.permissions = role ? DEFAULT_ROLE_PERMISSIONS[role] || {} : {};
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    touchActivity(state) {
      state.lastActivity = Date.now();
    },
    clearAuth(state) {
      state.user = null;
      state.profile = null;
      state.permissions = null;
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.profile = null;
      state.permissions = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        const role = action.payload.profile?.role;
        state.permissions = role ? DEFAULT_ROLE_PERMISSIONS[role] || {} : {};
        state.lastActivity = Date.now();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        const role = action.payload?.role;
        state.permissions = role ? DEFAULT_ROLE_PERMISSIONS[role] || {} : {};
      });
  },
});

export const { setUser, setProfile, setLoading, touchActivity, clearAuth, logout } =
  authSlice.actions;

export const selectIsSessionExpired = (state) =>
  Date.now() - state.auth.lastActivity > SESSION_TIMEOUT_MS;

export const initAuthListener = () => (dispatch) => {
  return subscribeAuth(async (user) => {
    try {
      if (user) {
        const profile = await fetchAdminProfile(user.uid);
        if (!profile || !isAdminRole(profile.role)) {
          await logoutApi();
          dispatch(clearAuth());
          return;
        }
        dispatch(setUser(user));
        dispatch(setProfile(profile));
      } else {
        dispatch(clearAuth());
      }
    } catch (err) {
      console.error('Auth profile load failed:', err);
      await logoutApi();
      dispatch(clearAuth());
    } finally {
      dispatch(setLoading(false));
    }
  });
};

export const signOutUser = () => async (dispatch) => {
  await logoutApi();
  dispatch(logout());
};

export default authSlice.reducer;
