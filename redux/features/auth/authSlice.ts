// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  USER = "USER",
}

export interface IUser {
  _id: string;

  name: string;
  email: string;

  role: UserRole;
  permissions: string[];

  avatar?: string | null;
  phone?: string | null;
  address?: string | null;

  lastLogin?: string | null;

  createdAt: string;
  updatedAt: string;
}

// Redux auth state
interface AuthState {
  user: IUser | null;
  accessToken: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
};

// Slice
const authSlice = createSlice({
  name: "AFAuth",
  initialState,
  reducers: {
    // When login/signup is successful
    setUser(
      state,
      action: PayloadAction<{ user: IUser | null; accessToken: string }>,
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },

    // Logout
    logout(state) {
      state.user = null;
      state.accessToken = null;
    },

    // Update user info only
    updateUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
  },
});

export const { setUser, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.AFAuth.user;
export const selectCurrentToken = (state: RootState) =>
  state.AFAuth.accessToken;
