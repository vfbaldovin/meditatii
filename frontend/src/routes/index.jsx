import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

import { Layout as MarketingLayout } from 'src/layouts/marketing';

import { authRoutes } from './auth-routes';
import { authDemoRoutes } from './auth-demo';
import { componentsRoutes } from './components';
import { dashboardRoutes } from './dashboard';

const Error401Page = lazy(() => import('src/pages/401'));
const Error404Page = lazy(() => import('src/pages/404'));
const Error500Page = lazy(() => import('src/pages/500'));

const HomePage = lazy(() => import('src/pages'));
const ListingPage = lazy(() => import('src/app/pages/listing-page'));

const ContactPage = lazy(() => import('src/pages/contact'));
const CheckoutPage = lazy(() => import('src/pages/checkout'));
const PricingPage = lazy(() => import('src/pages/pricing'));

const LoginClassicPage = lazy(() => import('src/app/pages/login-page'));


export const routes = [
  {
    element: (
      <MarketingLayout>
        <Outlet />
      </MarketingLayout>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'listing/:id',
        element: <ListingPage />,
      },
      /*{
        path: 'login',
        element: <LoginClassicPage />,
      },*/
      {
        path: 'pricing',
        element: <PricingPage />,
      },
      ...componentsRoutes,
    ],
  },
  ...authRoutes,
  ...authDemoRoutes,
  ...dashboardRoutes,
  {
    path: 'checkout',
    element: <CheckoutPage />,
  },
  {
    path: 'contact',
    element: <ContactPage />,
  },
  {
    path: '401',
    element: <Error401Page />,
  },
  {
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '500',
    element: <Error500Page />,
  },
  {
    path: '*',
    element: <Error404Page />,
  },
];
