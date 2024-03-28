import {createRoot} from 'react-dom/client';
import {Suspense} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';

import {App} from 'src/app';
import {GoogleOAuthProvider} from "@react-oauth/google";

const root = createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="91055256923-fojj1rktgs3et5b7ftkcn166bld5e90n.apps.googleusercontent.com">
        <Suspense>
          <App/>
        </Suspense>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </HelmetProvider>
);
