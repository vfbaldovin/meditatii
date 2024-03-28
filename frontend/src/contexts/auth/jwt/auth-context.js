import { createContext } from 'react';
import { Issuer } from 'src/utils/auth';

export const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  user_id:null
};

export const AuthContext = createContext({
  ...initialState,
  issuer: Issuer.JWT,
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});
