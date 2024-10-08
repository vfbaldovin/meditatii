import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

import { IssuerGuard } from 'src/guards/issuer-guard';
import { GuestGuard } from 'src/guards/guest-guard';
import { Layout as AuthLayout } from 'src/layouts/auth/classic-layout';
import { Issuer } from 'src/utils/auth';

// Amplify
const AmplifyConfirmRegisterPage = lazy(() => import('src/pages/auth/amplify/confirm-register'));
const AmplifyForgotPasswordPage = lazy(() => import('src/pages/auth/amplify/forgot-password'));
const AmplifyLoginPage = lazy(() => import('src/pages/auth/amplify/login'));
const AmplifyRegisterPage = lazy(() => import('src/pages/auth/amplify/register'));
const AmplifyResetPasswordPage = lazy(() => import('src/pages/auth/amplify/reset-password'));

// Auth0
const Auth0CallbackPage = lazy(() => import('src/pages/auth/auth0/callback'));
const Auth0LoginPage = lazy(() => import('src/pages/auth/auth0/login'));

// Firebase
const FirebaseLoginPage = lazy(() => import('src/pages/auth/firebase/login'));
const FirebaseRegisterPage = lazy(() => import('src/pages/auth/firebase/register'));

// JWT
const LoginPage = lazy(() => import('src/app/pages/login-page'));
const RegisterPage = lazy(() => import('src/app/pages/register-page'));
const RecoverPassword = lazy(() => import('src/app/pages/recover-password'));
const ResetPassword = lazy(() => import('src/app/pages/reset-password'));

export const authRoutes = [
  {
    // path: 'auth',
    children: [
      {
        path: 'amplify',
        element: (
          <IssuerGuard issuer={Issuer.Amplify}>
            <GuestGuard>
              <AuthLayout>
                <Outlet />
              </AuthLayout>
            </GuestGuard>
          </IssuerGuard>
        ),
        children: [
          {
            path: 'confirm-register',
            element: <AmplifyConfirmRegisterPage />,
          },
          {
            path: 'forgot-password',
            element: <AmplifyForgotPasswordPage />,
          },
          {
            path: 'login',
            element: <AmplifyLoginPage />,
          },
          {
            path: 'register',
            element: <AmplifyRegisterPage />,
          },
          {
            path: 'reset-password',
            element: <AmplifyResetPasswordPage />,
          },
        ],
      },
      {
        path: 'auth0',
        element: (
          <IssuerGuard issuer={Issuer.Auth0}>
            <GuestGuard>
              <Outlet />
            </GuestGuard>
          </IssuerGuard>
        ),
        children: [
          {
            path: 'callback',
            element: <Auth0CallbackPage />,
          },
          {
            path: 'login',
            element: <Auth0LoginPage />,
          },
        ],
      },
      {
        path: 'firebase',
        element: (
          <IssuerGuard issuer={Issuer.Firebase}>
            <GuestGuard>
              <AuthLayout>
                <Outlet />
              </AuthLayout>
            </GuestGuard>
          </IssuerGuard>
        ),
        children: [
          {
            path: 'login',
            element: <FirebaseLoginPage />,
          },
          {
            path: 'register',
            element: <FirebaseRegisterPage />,
          },
        ],
      },
      {
        // path: 'jwt',
        element: (
          <IssuerGuard issuer={Issuer.JWT}>
            <GuestGuard>
              <AuthLayout>
                <Outlet />
              </AuthLayout>
            </GuestGuard>
          </IssuerGuard>
        ),
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'login/:token',  // Add this line to handle token as a path parameter
            element: <LoginPage />,  // Reuse the same component
          },
          {
            path: 'register',
            element: <RegisterPage />,
          },
          {
            path: 'recover/password',
            element: <RecoverPassword />,
          },
          {
            path: 'reset/:token',
            element: <ResetPassword />,
          },
        ],
      },
    ],
  },
];
