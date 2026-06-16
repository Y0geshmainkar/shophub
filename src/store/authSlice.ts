import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; firstName: string } | null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: false, user: null } as AuthState,
  reducers: {
    login(state, action: PayloadAction<{ email: string; firstName: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
