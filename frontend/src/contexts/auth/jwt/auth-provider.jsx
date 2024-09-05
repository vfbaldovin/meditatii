import { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import { authApi } from 'src/api/auth';
import { Issuer } from 'src/utils/auth';
import { AuthContext, initialState } from './auth-context';
import {useAuth} from "../../../hooks/use-auth";

const STORAGE_KEY = 'accessToken';

var ActionType;
(function (ActionType) {
  ActionType['INITIALIZE'] = 'INITIALIZE';
  ActionType['SIGN_IN'] = 'SIGN_IN';
  ActionType['SIGN_UP'] = 'SIGN_UP';
  ActionType['SIGN_OUT'] = 'SIGN_OUT';
})(ActionType || (ActionType = {}));

const handlers = {
  INITIALIZE: (state, action) => {
    console.log('fiuuute')

    console.log(action.payload)

    const { isAuthenticated, user, user_id, user_name } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      user_id,
      user_name
    };
  },
  SIGN_IN: (state, action) => {
    const { user  } = action.payload;
    console.log('New state after SIGN_IN:', state);
    console.log('New state after SIGN_IN:', action);
    console.log('New state after SIGN_IN:', action);

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  SIGN_UP: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  SIGN_OUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    user_id: null,
    user_name: null,
  }),
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    console.log("AUTH PROVIDER LOADED")
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let accessToken = urlParams.get('accessToken') || window.sessionStorage.getItem('accessToken');
      let refreshToken = urlParams.get('refreshToken') || window.sessionStorage.getItem('refreshToken');
      let expiresAt = urlParams.get('expiresAt') || window.sessionStorage.getItem('expiresAt');
      // expiresAt = parseInt(expiresAt, 10); // Convert to integer if stored as a string

      if (urlParams.get('refreshToken')) {
        sessionStorage.setItem('refreshToken', refreshToken);
      }

      console.log('her')
      console.log(accessToken)
      console.log(refreshToken)

      let now = Date.now();

      // console.log(accessToken)
      // console.log(refreshToken)
      // console.log(expiresAt)
      // console.log(now)
      console.log(now)
      console.log('<')
      console.log(expiresAt)

      console.log(now < expiresAt)

      if (accessToken && now < expiresAt) {
        const user = await authApi.me(accessToken);
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: true,
            user: user.email,
            user_id: user.id,
            user_name: user.fullName,
          },
        });
      } else if (refreshToken) {

        const user = await authApi.me(accessToken);
        console.log('here')
        console.log(user)
        accessToken = await refreshAccessToken(refreshToken, user.email);
        if (accessToken) {
          dispatch({
            type: ActionType.INITIALIZE,
            payload: {
              isAuthenticated: true,
              user: user.email,
              user_id: user.id,
              user_name: user.fullName,
            },
          });
        } else {
          dispatch({
            type: ActionType.INITIALIZE,
            payload: {
              isAuthenticated: false,
              user: null,
              user_id: null,
              user_name: null,
            },
          });
        }
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
            user_id: null,
            user_name: null,
          },
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null,
          user_id: null,
          user_name: null,
        },
      });
    }
  }, [dispatch]);

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = useCallback(async (email, password) => {
    try {
      const { accessToken, refreshToken, expiresAt, user } = await authApi.signIn({ email, password });
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      sessionStorage.setItem('expiresAt', expiresAt);
      dispatch({
        type: ActionType.SIGN_IN,
        payload: { user },
      });
    } catch (err) {
      console.error(err);
      // Handle sign-in error (e.g., incorrect credentials)
      throw err;
    }
  }, [dispatch]);

  const resetPassword = useCallback(async ({ email }) => {
    await authApi.resetPassword({ email });
  }, []);

  const changePassword = useCallback(async ({ token, password }) => {
    await authApi.changePassword({ token, password });
  }, []);



  /*
    const signIn = useCallback(
      async (email, password) => {
        const { accessToken } = await authApi.signIn({ email, password });
        const user = await authApi.me({ accessToken });

        sessionStorage.setItem(STORAGE_KEY, accessToken);

        dispatch({
          type: ActionType.SIGN_IN,
          payload: {
            user,
          },
        });
      },
      [dispatch]
    );
  */
  const refreshAccessToken = async (refreshToken, username) => {
    try {
      const { accessToken, expiresAt } = await authApi.refreshToken({ refreshToken, username });
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('expiresAt', expiresAt);
      return accessToken;
    } catch (err) {
      console.error(err);
      // Handle refresh token error
    }
  };
  const signUp = useCallback(
    async (email, password) => {
      const { accessToken } = await authApi.signUp({ email, password });
      // const user = await authApi.me(accessToken);

      sessionStorage.setItem(STORAGE_KEY, accessToken);

      // dispatch({
      //   type: ActionType.SIGN_UP,
      //   payload: {
      //     user,
      //   },
      // });
    },
    [dispatch]
  );


  const signOut = useCallback(async () => {
    try {
      // Assuming you have the accessToken stored in sessionStorage
      const refreshToken = sessionStorage.getItem('refreshToken');

      // Call to backend to invalidate the accessToken

      // Remove tokens and other auth-related data from sessionStorage
      console.log("MARISU")
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('expiresAt');

      // Dispatch sign out action to update local state
      dispatch({ type: ActionType.SIGN_OUT });
      await authApi.signOut({ refreshToken });

    } catch (err) {
      console.error(err);
      // Optionally handle errors (e.g., logging out user locally even if backend call fails)
      dispatch({ type: ActionType.SIGN_OUT });
    }
  }, [dispatch]);


  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: Issuer.JWT,
        signIn,
        signUp,
        signOut,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
