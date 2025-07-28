// store/authSlice.ts
import { setCookie, removeCookie } from '@/utils/cookieUtil';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  password: string | null;
  social: string | null;
  id: string | null;
  roleNames: string | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  password: null,
  social: null,
  id: null,
  roleNames: null,
  email: null,
  accessToken: null,
  refreshToken: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ password: string, social: string, id: string, roleNames: string, email: string, accessToken: string, refreshToken: string }>) {
      //state.token = action.payload.token;
      //state.username = action.payload.username;
      console.log("login.....");
      console.log("state=>" + JSON.stringify(state));

      const data = action.payload;

      console.log("data=>" + JSON.stringify(data));

      setCookie("member", JSON.stringify(data) , 1); //1일

      return data;
    },
    logout(state) {
      console.log("logout.....");
      console.log("state=>" + JSON.stringify(state));
      
      removeCookie("member");

      //state.token = null;
      //state.username = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
