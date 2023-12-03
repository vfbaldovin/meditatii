import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import {useTheme} from '@mui/material/styles';

import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {useNavigate, useParams} from "react-router";
import React, {useEffect, useState} from 'react';
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import {ArrowNarrowLeft} from "@untitled-ui/icons-react";
import {AnnouncementBio} from "../sections/announcement/announcement-bio";
import Link from "@mui/material/Link";

const Page = () => {
  const theme = useTheme();
  const {id} = useParams();
  const [announcement, setAnnouncement] = useState({
    title: '',
    description: '',
    // Add other properties with default values as needed
  });
  const [tutorImageUrl, setTutorImageUrl] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/announcement/${id}`);
        setAnnouncement(response.data);

        const imageResponse = await axios.get(`${apiBaseUrl}/user/${response.data.tutorId}/profile-image`, {responseType: 'blob'});
        const imageUrl = URL.createObjectURL(imageResponse.data);
        setTutorImageUrl(imageUrl);
      } catch (error) {
        console.error('Error fetching announcement:', error);
      }
    };

    fetchAnnouncement();
  }, [id]);

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  usePageView();

  return (
    <>
      <Seo title={announcement.subject}/>
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={1}>
            <Box sx={{
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
              pt: {
                xs: '6rem',
                sm: '6rem',
                md: '7rem',
                lg: '7rem',
              }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 2 }}>
                <Typography onClick={goBack} sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}>
                  <SvgIcon style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                    <ArrowNarrowLeft/>
                  </SvgIcon>
                  {announcement.subject}
                </Typography>
              </Box>

            </Box>
          </Stack>
        </Container>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: {
            xs: '10px',
            sm: '10px',
            md: '10px',
            lg: '20px',
          }
        }}
      >
        <Container maxWidth="lg">
          <Stack
            divider={<Divider/>}
            spacing={4}
          >

            <Grid
              key={'D'}
              container
              spacing={4}
            >
              <Grid
                xs={12}
                lg={3}
                className="largeScreenAvatar"
              >
                <Avatar
                  src={tutorImageUrl}
                  sx={{
                    width: '100px',
                    height: '100px',
                    border: (theme) =>
                      theme.palette.mode === 'dark' ? '4px solid #0E1320' : '4px solid white',
                  }}
                />

                <Typography
                  sx={{fontWeight: 800}}
                  variant="h4"
                >
                  {announcement.tutorName}
                </Typography>
                <Typography variant="body1">
                  Vârstă{' '}
                  <span style={{fontWeight: 800}}>
                    {announcement.age} ani
                  </span>
                </Typography>

                <AnnouncementBio announcement={announcement}/>

              </Grid>
              <Grid
                xs={12}
                lg={9}
              >
                <Grid
                  container
                  spacing={4}
                  className="largeScreenAvatar2"
                >
                  <Grid
                    xs={12}
                    lg={9}>
                    <Typography variant="h4">
                      {announcement.title}
                    </Typography>
                  </Grid>
                  <Typography
                    variant="body1"
                    sx={{padding: 2, whiteSpace: 'pre-wrap'}}
                  >
                    {announcement.description}
                  </Typography>
                </Grid>

              </Grid>
            </Grid>

          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
