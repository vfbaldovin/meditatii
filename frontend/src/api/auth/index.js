import { createResourceId } from 'src/utils/create-resource-id';
import { decode, JWT_EXPIRES_IN, JWT_SECRET, sign } from 'src/utils/jwt';
import { wait } from 'src/utils/wait';

import { users } from './data';

const STORAGE_KEY = 'users';

// NOTE: We use sessionStorage since memory storage is lost after page reload.
//  This should be replaced with a server call that returns DB persisted data.

const getPersistedUsers = () => {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
};

const persistUser = (user) => {
  try {
    const users = getPersistedUsers();
    const data = JSON.stringify([...users, user]);
    sessionStorage.setItem(STORAGE_KEY, data);
  } catch (err) {
    console.error(err);
  }
};
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

class AuthApi {
  async signIn({ email, password }) {
    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sign in');
    }
    return response.json();
  }

  async refreshToken({ refreshToken, username }) {
    const response = await fetch(`${apiBaseUrl}/api/auth/refresh/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken, username }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to refresh token');
    }
    return response.json();
  }

  async signUp({ email, password }) {
    const response = await fetch(`${apiBaseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sign up');
    }

    return response.json(); // Expects to receive { accessToken }
  }

  async resetPassword({ email }) {
    const response = await fetch(`${apiBaseUrl}/api/auth/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reset password');
    }
    return response.json();
  }

/*  async changePassword({ token, password }) {
    const response = await fetch(`${apiBaseUrl}/api/auth/changePassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    // Ensure we are correctly parsing the response body
    const responseData = await response.json().catch(() => undefined);

    if (!response.ok) {
      throw new Error(responseData ? responseData.message : 'Failed to change password');
    }

    return responseData; // This should return the parsed JSON object
  }*/

  async me(accessToken) {
    const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user profile');
    }
    return response.json(); // Expects to receive user details
  }
/*  async signIn(request) {
    const { email, password } = request;

    await wait(500);

    return new Promise((resolve, reject) => {
      try {
        // Merge static users (data file) with persisted users (browser storage)
        const mergedUsers = [...users, ...getPersistedUsers()];

        // Find the user
        const user = mergedUsers.find((user) => user.email === email);

        if (!user || user.password !== password) {
          reject(new Error('Please check your email and password'));
          return;
        }

        // Create the access token
        const accessToken = sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        resolve({ accessToken });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async signUp(request) {
    const { email, name, password } = request;

    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        // Merge static users (data file) with persisted users (browser storage)
        const mergedUsers = [...users, ...getPersistedUsers()];

        // Check if a user already exists
        let user = mergedUsers.find((user) => user.email === email);

        if (user) {
          reject(new Error('User already exists'));
          return;
        }

        user = {
          id: createResourceId(),
          avatar: undefined,
          email,
          name,
          password,
          plan: 'Standard',
        };

        persistUser(user);

        const accessToken = sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        resolve({ accessToken });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  me(request) {
    const { accessToken } = request;

    return new Promise((resolve, reject) => {
      try {
        // Decode access token
        const decodedToken = decode(accessToken);

        // Merge static users (data file) with persisted users (browser storage)
        const mergedUsers = [...users, ...getPersistedUsers()];

        // Find the user
        const { userId } = decodedToken;
        const user = mergedUsers.find((user) => user.id === userId);

        if (!user) {
          reject(new Error('Invalid authorization token'));
          return;
        }

        resolve({
          id: user.id,
          avatar: user.avatar,
          email: user.email,
          name: user.name,
          plan: user.plan,
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }*/
  async signOut({ refreshToken}) {
    console.log("AAAAAAAAAAAAAAAAAAAAA")
    const response = await fetch(`${apiBaseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }), // Include username if needed, or you can omit it if the backend doesn't require it for logout
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sign out');
    }
    return response.json();
  }

}

export const authApi = new AuthApi();
