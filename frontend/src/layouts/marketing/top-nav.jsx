import React, {useCallback, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';
import { alpha } from '@mui/system/colorManipulator';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Logo } from 'src/components/logo';
import { RouterLink } from 'src/components/router-link';
import { usePathname } from 'src/hooks/use-pathname';
import { useWindowScroll } from 'src/hooks/use-window-scroll';
import { paths } from 'src/paths';

import { PagesPopover } from './pages-popover';
import { TopNavItem } from './top-nav-item';
import {User03} from "@untitled-ui/icons-react";
import {useNavigate} from "react-router";
import {useAuth} from "../../hooks/use-auth";
import {AuthContext} from "../../contexts/auth/jwt";

const items = [
  {
    title: 'Comunitate',
    path: paths.components.index,
  },
  {
    title: 'E-learning',
    popover: <PagesPopover />,
  },
  {
    title: 'Cum funcționează?',
    path: paths.docs,
    external: true,
  },
];

const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const { onMobileNavOpen } = props;
  const pathname = usePathname();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [elevate, setElevate] = useState(false);
  const offset = 64;
  const delay = 100;

  const handleWindowScroll = useCallback(() => {
    if (window.scrollY > offset) {
      setElevate(true);
    } else {
      setElevate(false);
    }
  }, []);

  useWindowScroll({
    handler: handleWindowScroll,
    delay,
  });

  const { user } = useAuth();
  const { isAuthenticated } = useContext(AuthContext);

  const navigate = useNavigate();
  const handleLoginClick = () => {

    if (location.pathname === '/login') {
      return;
    }
      navigate('/login');
  };

  return (
    <Box
      component="header"
      sx={{
        left: 0,
        position: 'fixed',
        right: 0,
        top: 0,
        pt: 2,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: 'transparent',
          borderRadius: 2.5,
          boxShadow: 'none',
          transition: (theme) =>
            theme.transitions.create('box-shadow, background-color', {
              easing: theme.transitions.easing.easeInOut,
              duration: 200,
            }),
          ...(elevate && {
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
            boxShadow: 8,
          }),
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ height: TOP_NAV_HEIGHT }}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={1}
            sx={{ flexGrow: 1 }}
          >
            <Stack
              alignItems="center"
              component={RouterLink}
              direction="row"
              display="inline-flex"
              href={paths.index}
              spacing={1}
              sx={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  height: 24,
                  width: 24,
                }}
              >
                <Logo />
              </Box>
              {mdUp && (
                <Box
                  sx={{
                    color: 'text.primary',
                    fontFamily: "'ProximaNova', sans-serif",
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: '0.3px',
                    lineHeight: 2.5,
                    '& span': {
                      color: 'primary.main',
                    },
                  }}
                >
                  Meditații anunțuri
                </Box>
              )}
            </Stack>

          </Stack>
          {mdUp && (
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
            >
              <Box
                component="nav"
                sx={{ height: '100%' }}
              >
                <Stack
                  component="ul"
                  alignItems="center"
                  justifyContent="center"
                  direction="row"
                  spacing={1}
                  sx={{
                    height: '100%',
                    listStyle: 'none',
                    m: 0,
                    p: 0,
                  }}
                >
                  <>
                    {items.map((item) => {
                      const checkPath = !!(item.path && pathname);
                      const partialMatch = checkPath ? pathname.includes(item.path) : false;
                      const exactMatch = checkPath ? pathname === item.path : false;
                      const active = item.popover ? partialMatch : exactMatch;

                      return (
                        <TopNavItem
                          active={active}
                          external={item.external}
                          key={item.title}
                          path={item.path}
                          popover={item.popover}
                          title={item.title}
                        />
                      );
                    })}
                  </>
                </Stack>
              </Box>
            </Stack>
          )}
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{ flexGrow: 1 }}
          >
            {isAuthenticated ? (
              // Display the user's name and navigate to /dashboard when clicked
              <Button
                component="a"
                size={mdUp ? 'medium' : 'small'}
                color="inherit"
                variant="outlined"
                onClick={() => navigate('/dashboard')}
                startIcon={
                  <SvgIcon fontSize="small">
                    <User03 />
                  </SvgIcon>
                }
              >
                {user.split('@')[0]} {/* Assuming 'username' is the attribute holding the user's name */}
              </Button>
            ) : (
              // Display the login button if the user is not authenticated
              <Button
                component="a"
                size={mdUp ? 'medium' : 'small'}
                color="inherit"
                variant="outlined"
                onClick={handleLoginClick}
                startIcon={
                  <SvgIcon fontSize="small">
                    <User03 />
                  </SvgIcon>
                }
              >
                Autentificare
              </Button>
            )}
            {!mdUp && (
              <IconButton onClick={onMobileNavOpen}>
                <SvgIcon fontSize="small">
                  <Menu01Icon />
                </SvgIcon>
              </IconButton>
            )}
          </Stack>

        </Stack>
      </Container>
    </Box>
  );
};

TopNav.propTypes = {
  onMobileNavOpen: PropTypes.func,
};
