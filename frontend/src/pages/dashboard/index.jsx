import React, {useCallback, useEffect, useRef, useState} from 'react';
import { subDays, subHours, subMinutes, subMonths } from 'date-fns';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import axios from 'axios';  // Axios for API calls

import { Seo } from 'src/components/seo';
import { getAuthenticatedUser } from 'src/app/hooks/get-authenticated-user';
import { usePageView } from 'src/hooks/use-page-view';
import { AccountBillingSettings } from 'src/sections/dashboard/account/account-billing-settings';
import { AccountNotificationsSettings } from 'src/sections/dashboard/account/account-notifications-settings';
import { AccountTeamSettings } from 'src/sections/dashboard/account/account-team-settings';
import { AccountSecuritySettings } from 'src/sections/dashboard/account/account-security-settings';
import { PersonalListingsTable } from '../../sections/dashboard/listings/personal-listings-table';
import CircularProgress from "@mui/material/CircularProgress";
import {
  PersonalListingsSkeletonTable
} from "../../sections/dashboard/listings/personal-listings-skeleton-table";
import {RouterLink} from "../../components/router-link";
import {paths} from "../../paths";
import {useAuth} from "../../hooks/use-auth";
import {AccountAvatar} from "../../sections/dashboard/account/account-avatar";
import useMediaQuery from "@mui/material/useMediaQuery";
import {CustomerBasicDetails} from "../../sections/dashboard/customer/customer-basic-details";
import CardHeader from "@mui/material/CardHeader";
import {ProfileCompleteProgress} from "../../sections/dashboard/academy/profile-complete-progress";
import CheckVerified01 from "@untitled-ui/icons-react/build/esm/CheckVerified01";
import {PromoteCard} from "./profile/promote-card";
import Tooltip from "@mui/material/Tooltip";
import confetti from "canvas-confetti";


const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Billing', value: 'billing' },
  { label: 'Team', value: 'team' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Security', value: 'security' },
];

const now = new Date();

const Page = () => {
  const user = getAuthenticatedUser();
  const [currentTab, setCurrentTab] = useState('general');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [personalListings, setPersonalListings] = useState([]);  // State for listings
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const isSmallScreen = useMediaQuery('(max-width:1200px)'); // Check if screen width is less than 1200px
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [promoted, setPromoted] = useState(false);
  const [verified, setVerified] = useState(false);
  // Bearer token from authentication (assuming it's stored in localStorage)
  const token = sessionStorage.getItem('accessToken');
  const { fetchWithAuth } = useAuth(); // Destructure fetchWithAuth from useAuth

  const [isPromoteHovered, setIsPromoteHovered] = useState(false);
  const isPromoted = promoted;


  // usePageView();

  // Function to fetch personal listings from the backend
  useEffect(() => {
    const fetchPersonalListings = async () => {
      try {
        setLoading(true);

        // Fetch listings
        const response = await fetchWithAuth(`/api/dashboard/listings`);
        if (!response.ok) {
          throw new Error('Failed to fetch data from server');
        }
        const data = await response.json();
        setPersonalListings(data);
      } catch (err) {
        console.error('Failed to fetch personal listings:', err);
        setError('Failed to fetch data from server');
      }
    };

    const fetchPromotedInfo = async () => {
      try {
        // Fetch promoted info
        const response = await fetchWithAuth(`/api/dashboard/profile/info/promoted`);
        if (!response.ok) {
          throw new Error('Failed to fetch promoted info');
        }
        const data = await response.json();

        // Update state with response data
        setPromoted(data.promoted);
        setVerified(data.verified);
      } catch (err) {
        console.error('Failed to fetch promoted info:', err);
        setError('Failed to fetch promoted info');
      }
    };

    // Fetch data from both endpoints
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchPersonalListings(), fetchPromotedInfo()]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchWithAuth]);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 400,
      spread: 120,
      startVelocity: 80,
      scalar: 1.5,
      origin: {x: 1, y: 0.5}
    });
    confetti({
      particleCount: 400,
      spread: 120,
      startVelocity: 80,
      scalar: 1.5,
      origin: {x: 0, y: 0.5}
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('p') === 'success') {
      triggerConfetti();
    }
  }, []);

  return (
    <>
      <Seo title="Dashboard: Account" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >

        <Container maxWidth="xl">
          <Stack spacing={3} sx={{mb: 3}}>
            <Stack
              alignItems="flex-start"
              direction={{
                xs: 'column',
                md: 'row',
              }}
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <AccountAvatar avatar={user.avatar}></AccountAvatar>

                  <Stack spacing={1}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between', // Ensures even spacing between the header and button
                        alignItems: 'center',           // Vertically aligns items on the same line
                        // padding: 2,                     // Adds some padding for layout
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }, // Responsive font sizes
                          overflow: 'hidden', // Ensure no overflow
                          textOverflow: 'ellipsis', // Add ellipsis if text overflows
                          whiteSpace: 'nowrap', // Prevent text wrapping
                          width: '100%', // Occupy full width of the parent container
                          maxWidth: '60vw', // Prevent exceeding the viewport width
                        }}
                      >
                        {user.email}
                      </Typography>
                      {(verified || isPromoteHovered) && (
                        verified ? (
                          // Show the icon without Tooltip when verified is true
                          <SvgIcon
                            sx={{
                              ml: 1,
                              color: 'white',
                              '& path': {
                                fill: 'none',
                                stroke: (theme) => theme.palette.primary.main,
                                strokeWidth: 2,
                              },
                            }}
                          >
                            <CheckVerified01 />
                          </SvgIcon>
                        ) : (
                          // Wrap the icon in Tooltip when isPromoteHovered is true and verified is false
                          <Tooltip
                            title="Insignă meditator verificat disponibilă permanent"
                            arrow
                            open={isPromoteHovered}
                            placement="bottom-start"
                            PopperProps={{
                              modifiers: [
                                {
                                  name: 'zIndex',
                                  enabled: true,
                                  phase: 'afterWrite',
                                  fn: ({ state }) => {
                                    state.styles.popper.zIndex = 1098; // Adjust as needed to be below your header
                                  },
                                },
                              ],
                            }}
                          >
                            <SvgIcon
                              sx={{
                                ml: 1,
                                color: 'white',
                                '& path': {
                                  fill: 'none',
                                  stroke: (theme) => theme.palette.primary.main,
                                  strokeWidth: 2,
                                },
                              }}
                            >
                              <CheckVerified01 />
                            </SvgIcon>
                          </Tooltip>
                        )
                      )}

                    </Box>
                    {/*<Stack*/}
                    {/*  alignItems="center"*/}
                    {/*  direction="row"*/}
                    {/*  spacing={1}*/}
                    {/*>*/}
                    {/*  <Typography variant="subtitle2">user_id:</Typography>*/}
                    {/*  <Chip*/}
                    {/*    label={user.email}*/}
                    {/*    size="small"*/}
                    {/*  />*/}
                    {/*</Stack>*/}
                  </Stack>
                </Stack>
              </Stack>

            </Stack>

            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              textColor="primary"
              value={currentTab}
              variant="scrollable"
              sx={{
                minHeight: '48px', // Adjust the height of the Tabs component
              }}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                  sx={{
                    fontSize: '16px', // Adjust the font size of the Tab label
                    minHeight: '48px', // Adjust the height of each Tab
                    padding: '12px',   // Adjust the padding inside each Tab
                  }}
                />
              ))}
            </Tabs>

            <Divider />
          </Stack>

          {currentTab === 'general' && (
            <>
              <Grid container spacing={4}>
                {/* CustomerBasicDetails */}
                <Grid
                  xs={12}
                  lg={4}
                  sx={{
                    order: isSmallScreen ? 2 : 1, // Dynamically set order
                  }}
                >
                  <CustomerBasicDetails
                    onCompletionPercentage={(percentage) => setCompletionPercentage(percentage)}
                  />
                </Grid>

                {/* Anunțuri Card and ProfileCompleteProgress */}
                <Grid
                  xs={12}
                  lg={8}
                  sx={{
                    order: isSmallScreen ? 1 : 2, // Dynamically set order
                  }}
                >
                  <Stack spacing={4}>
                    {isSmallScreen ? (
                      <>
                        <Card>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between', // Even spacing
                              alignItems: 'center', // Align items vertically
                              padding: 2, // Padding for layout
                            }}
                          >
                            <CardHeader title="Anunțuri" sx={{ p: 1 }} />
                            <Button
                              component={RouterLink}
                              href={paths.dashboard.listings.create}
                              startIcon={
                                <SvgIcon>
                                  <PlusIcon />
                                </SvgIcon>
                              }
                              variant="contained"
                            >
                              Adaugă anunț
                            </Button>
                          </Box>
                          <CardContent>
                            {loading ? (
                              <Box sx={{ position: 'relative', height: '100%' }}>
                                <PersonalListingsSkeletonTable />
                                <Box
                                  sx={{
                                    position: 'fixed',
                                    top: '57.5%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                >
                                  <CircularProgress size={40} thickness={6} style={{ opacity: 0.7 }} />
                                </Box>
                              </Box>
                            ) : error ? (
                              <Typography color="error">{error}</Typography>
                            ) : personalListings.length === 0 ? (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '100%',
                                  gap: 2,
                                }}
                              >
                                <Typography variant="h6">Nu există anunțuri publicate.</Typography>
                              </Box>
                            ) : (
                              <PersonalListingsTable
                                count={personalListings.length}
                                items={personalListings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                isPromoted={isPromoted} // Pass computed value here
                              />
                            )}
                          </CardContent>
                        </Card>

                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' }, // Stack pe verticală pentru ecrane mici, orizontală pentru ecrane mari
                            alignItems: 'center', // Aliniere verticală
                            justifyContent: { xs: 'flex-start' }, // Spațiere pentru ecrane mari
                            gap: 4, // Spațiu între elemente
                          }}
                        >
                            <PromoteCard onHoverChange={(isHovered) => setIsPromoteHovered(isHovered)} />

                          <ProfileCompleteProgress
                            timeCurrent={completionPercentage}
                            timeGoal={100}
                          />
                        </Box>

                      </>
                    ) : (
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' }, // Stack pe verticală pentru ecrane mici, orizontală pentru ecrane mari
                            alignItems: 'center', // Aliniere verticală
                            justifyContent: { xs: 'flex-start' }, // Spațiere pentru ecrane mari
                            gap: 4, // Spațiu între elemente
                          }}
                        >
                          <ProfileCompleteProgress
                            timeCurrent={completionPercentage}
                            timeGoal={100}
                          />
                          <PromoteCard onHoverChange={(isHovered) => setIsPromoteHovered(isHovered)} />
                        </Box>

                        <Card>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between', // Even spacing
                              alignItems: 'center', // Align items vertically
                              padding: 2, // Padding for layout
                            }}
                          >
                            <CardHeader title="Anunțuri" sx={{ p: 1 }} />
                            <Button
                              component={RouterLink}
                              href={paths.dashboard.listings.create}
                              startIcon={
                                <SvgIcon>
                                  <PlusIcon />
                                </SvgIcon>
                              }
                              variant="contained"
                            >
                              Adaugă anunț
                            </Button>
                          </Box>
                          <CardContent>
                            {loading ? (
                              <Box sx={{ position: 'relative', height: '100%' }}>
                                <PersonalListingsSkeletonTable />
                                <Box
                                  sx={{
                                    position: 'fixed',
                                    top: '57.5%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                >
                                  <CircularProgress size={40} thickness={6} style={{ opacity: 0.7 }} />
                                </Box>
                              </Box>
                            ) : error ? (
                              <Typography color="error">{error}</Typography>
                            ) : personalListings.length === 0 ? (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '100%',
                                  gap: 2,
                                }}
                              >
                                <Typography variant="h6">Nu există anunțuri publicate.</Typography>
                              </Box>
                            ) : (
                              <PersonalListingsTable
                                count={personalListings.length}
                                items={personalListings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                isPromoted={isPromoted} // Pass computed value here
                              />
                            )}
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </Stack>

                </Grid>
              </Grid>
            </>
          )}

          {currentTab === 'billing' && (
            <AccountBillingSettings
              plan="standard"
              invoices={[
                {
                  id: '5547409069c59755261f5546',
                  amount: 4.99,
                  createdAt: subMonths(now, 1).getTime(),
                },
                {
                  id: 'a3e17f4b551ff8766903f31f',
                  amount: 4.99,
                  createdAt: subMonths(now, 2).getTime(),
                },
                {
                  id: '28ca7c66fc360d8203644256',
                  amount: 4.99,
                  createdAt: subMonths(now, 3).getTime(),
                },
              ]}
            />
          )}
          {currentTab === 'team' && (
            <AccountTeamSettings
              members={[
                {
                  avatar: '/assets/avatars/avatar-cao-yu.png',
                  email: 'cao.yu@devias.io',
                  name: 'Cao Yu',
                  role: 'Owner',
                },
                {
                  avatar: '/assets/avatars/avatar-siegbert-gottfried.png',
                  email: 'siegbert.gottfried@devias.io',
                  name: 'Siegbert Gottfried',
                  role: 'Standard',
                },
              ]}
            />
          )}
          {currentTab === 'notifications' && <AccountNotificationsSettings />}
          {currentTab === 'security' && (
            <AccountSecuritySettings
              loginEvents={[
                {
                  id: '1bd6d44321cb78fd915462fa',
                  createdAt: subDays(subHours(subMinutes(now, 5), 7), 1).getTime(),
                  ip: '95.130.17.84',
                  type: 'Credential login',
                  userAgent: 'Chrome, Mac OS 10.15.7',
                },
                {
                  id: 'bde169c2fe9adea5d4598ea9',
                  createdAt: subDays(subHours(subMinutes(now, 25), 9), 1).getTime(),
                  ip: '95.130.17.84',
                  type: 'Credential login',
                  userAgent: 'Chrome, Mac OS 10.15.7',
                },
              ]}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

export default Page;
