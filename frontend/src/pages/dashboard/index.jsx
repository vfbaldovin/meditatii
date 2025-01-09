import React, { useCallback, useEffect, useState } from 'react';
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
import { AccountGeneralSettings } from 'src/sections/dashboard/account/account-general-settings';
import { AccountNotificationsSettings } from 'src/sections/dashboard/account/account-notifications-settings';
import { AccountTeamSettings } from 'src/sections/dashboard/account/account-team-settings';
import { AccountSecuritySettings } from 'src/sections/dashboard/account/account-security-settings';
import { PersonalListingsTable } from '../../sections/dashboard/listings/personal-listings-table';
import { OverviewDoneTasks } from "../../sections/dashboard/overview/overview-done-tasks";
import { OverviewPendingIssues } from "../../sections/dashboard/overview/overview-pending-issues";
import { OverviewOpenTickets } from "../../sections/dashboard/overview/overview-open-tickets";
import CircularProgress from "@mui/material/CircularProgress";
import {
  PersonalListingsSkeletonTable
} from "../../sections/dashboard/listings/personal-listings-skeleton-table";
import {RouterLink} from "../../components/router-link";
import {paths} from "../../paths";
import {useAuth} from "../../hooks/use-auth";
import Chip from "@mui/material/Chip";
import {AccountAvatar} from "../../sections/dashboard/account/account-avatar";


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

  // Bearer token from authentication (assuming it's stored in localStorage)
  const token = sessionStorage.getItem('accessToken');
  const { fetchWithAuth } = useAuth(); // Destructure fetchWithAuth from useAuth

  usePageView();

  // Function to fetch personal listings from the backend
  useEffect(() => {
    const fetchPersonalListings = async () => {
      try {
        setLoading(true);
        // Use fetchWithAuth instead of axios
        const response = await fetchWithAuth(`/api/dashboard/listings`);

        // Check if response is OK (status 200-299)
        if (!response.ok) {
          throw new Error('Failed to fetch data from server');
        }

        const data = await response.json();
        setPersonalListings(data); // Store fetched data in state
      } catch (err) {
        console.error('Failed to fetch personal listings:', err);
        setError('Failed to fetch data from server');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalListings();
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
          <Stack spacing={3} sx={{ mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <AccountAvatar avatar={user.avatar}></AccountAvatar>

                  <Stack spacing={1}>
                    <Typography variant="h4">{user.email}</Typography>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                    >
                      <Typography variant="subtitle2">user_id:</Typography>
                      <Chip
                        label={user.email}
                        size="small"
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={2}>
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
              <Grid mb={3} container disableEqualOverflow spacing={{ xs: 3, lg: 4 }}>
                <Grid xs={12} md={4}>
                  <OverviewDoneTasks amount={31} />
                </Grid>
                <Grid xs={12} md={4}>
                  <OverviewPendingIssues amount={12} />
                </Grid>
                <Grid xs={12} md={4}>
                  <OverviewOpenTickets amount={5} />
                </Grid>
              </Grid>

              <Box mb={3}>
                <Card>
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid xs={12} md={4}>
                        <Typography variant="h6">Anunțuri</Typography>
                      </Grid>
                      <Grid xs={12} md={8}>
                        {loading ? (
                          <Box sx={{position: 'relative', height: '100%'}}>
                            <PersonalListingsSkeletonTable />
                            <Box sx={{
                              position: 'fixed',
                              top: '57.5%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)'
                            }}>
                              <CircularProgress size={40} thickness={6} style={{opacity: 0.7}}/>
                            </Box>
                          </Box>                        ) : error ? (
                          <Typography color="error">{error}</Typography>
                        ) : (
                          <PersonalListingsTable
                            count={personalListings.length}
                            items={personalListings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                          />
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>

              <Box mb={3}>
                <AccountGeneralSettings
                  avatar={user.avatar || ''}
                  email={user.email || ''}
                  name={user.name || ''}
                />
              </Box>
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
