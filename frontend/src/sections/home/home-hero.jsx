import EyeIcon from '@untitled-ui/icons-react/build/esm/Eye';
import LayoutBottomIcon from '@untitled-ui/icons-react/build/esm/LayoutBottom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import {CourseSearch} from 'src/sections/dashboard/academy/course-search';

import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';

import { HomeCodeSamples } from './home-code-samples';
import React, { useState, useEffect } from 'react';
import Chip from "@mui/material/Chip";
import {TrendingUp} from "@mui/icons-material";
import {GridList2} from "../components/grid-lists/grid-list-2";
import axios from "axios";

export const HomeHero = () => {
  const theme = useTheme();
  const [subject, setSubject] = useState('Engleză');
  const subjects = ['Limba engleză', 'Matematică', 'Limba franceză', 'Informatică', 'Biologie', 'Limba germană','Chimie', 'Limba română', 'Fizică'];
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(200);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const cursorStyle = {
    display: 'inline-block',
    marginLeft: '2px',
    backgroundColor: 'currentColor',
    width: '3px',
    height: '1em',
    animation: 'blink 1s step-start 0s infinite',
  };


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Adjust the URL to your actual endpoint
        const response = await axios.get(`${apiBaseUrl}/announcements/paginated?page=${page}&size=${size}`);
        const announcements = response.data.content; // Assuming your data has a 'content' key with the announcements
        const announcementWithImages = await Promise.all(announcements.map(async (announcement) => {
          const imageResponse = await axios.get(`${apiBaseUrl}/user/${announcement.tutorId}/profile-image`, { responseType: 'blob' });
          const imageUrl = URL.createObjectURL(imageResponse.data);
          return { ...announcement, tutorImage: imageUrl };
        }));
        setProjects(announcementWithImages);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();

    let currentSubjectIndex = 0;
    let currentCharacterIndex = 0;
    let direction = 'forward';
    let isMounted = true;

    const updateSubject = () => {
      setTimeout(() => {
        if (!isMounted) return;

        if (direction === 'forward') {
          currentCharacterIndex++;
          if (currentCharacterIndex > subjects[currentSubjectIndex].length) {
            direction = 'backward';
            setTimeout(updateSubject, 2000); // Wait before deleting
            return;
          }
        } else {
          currentCharacterIndex--;
          if (currentCharacterIndex === 0) {
            direction = 'forward';
            currentSubjectIndex = (currentSubjectIndex + 1) % subjects.length;
          }
        }

        setSubject(subjects[currentSubjectIndex].slice(0, currentCharacterIndex));
        updateSubject();
      }, direction === 'forward' ? 100 : 50); // Typing speed and deleting speed
    };

    updateSubject();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, page, size]);

  return (
    <Box
      sx={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundImage: 'url("/assets/gradient-bg.svg")',
        pt: '120px',
      }}
    >
      <Container maxWidth="lg">


        <Box maxWidth="lg">
          <Typography
            variant="h2"
            sx={{ mb: 1, textAlign: 'center'}}
          >
            Învață sau oferă pregătire la&nbsp;
          </Typography>
          <Typography
            color="primary.main"
            variant="h2"
            sx={{ mb: 3, textAlign: 'center'}}
          >
            {subject} <span style={cursorStyle} />
          </Typography>
          <Box mb={3} display='flex' justifyContent='center' alignItems='center'>
            <CourseSearch />
          </Box>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            mb={3}
            sx={{
              flexWrap: 'wrap',
              gap: 1, // creates a gap between items on wrap
              '& > *': { // applies the style to all direct children
                marginBottom: '8px', // or use theme.spacing(1) for theme-consistent spacing
              },
            }}
          >
            <SvgIcon sx={{marginBottom: 'unset'}}>
              <TrendingUp />
            </SvgIcon>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: 18,
                fontWeight: 'bold',
                marginLeft: 0
              }}
            >Populare:
            </Typography>

            {subjects.map((item) => (
              <Chip
                label={item}
                key={item}
              />
            ))}
          </Stack>



          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            spacing={1}
            sx={{ my: 3 }}
          >
            <Rating
              readOnly
              value={4.7}
              precision={0.1}
              max={5}
            />
            <Typography
              color="text.primary"
              variant="caption"
              sx={{ fontWeight: 700 }}
            >
              4.7/5
            </Typography>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              based on (70+ reviews)
            </Typography>
          </Stack>

            <Container maxWidth="lg">
              <Stack spacing={8}>

                <GridList2 projects={projects} />
              </Stack>
            </Container>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Button
              component={RouterLink}
              href={paths.dashboard.index}
              startIcon={
                <SvgIcon fontSize="small">
                  <EyeIcon />
                </SvgIcon>
              }
              sx={(theme) =>
                theme.palette.mode === 'dark'
                  ? {
                      backgroundColor: 'neutral.50',
                      color: 'neutral.900',
                      '&:hover': {
                        backgroundColor: 'neutral.200',
                      },
                    }
                  : {
                      backgroundColor: 'neutral.900',
                      color: 'neutral.50',
                      '&:hover': {
                        backgroundColor: 'neutral.700',
                      },
                    }
              }
              variant="contained"
            >
              Live Demo
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              href={paths.components.index}
              startIcon={
                <SvgIcon fontSize="small">
                  <LayoutBottomIcon />
                </SvgIcon>
              }
            >
              Components
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            pt: '120px',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              overflow: 'hidden',
              width: '90%',
              fontSize: 0,
              mt: -2,
              mx: -2,
              pt: 2,
              px: 2,
              '& img': {
                borderTopLeftRadius: (theme) => theme.shape.borderRadius * 2.5,
                borderTopRightRadius: (theme) => theme.shape.borderRadius * 2.5,
                boxShadow: 16,
                width: '100%',
              },
            }}
          >
            <img
              src={
                theme.palette.mode === 'dark'
                  ? '/assets/home-thumbnail-dark.png'
                  : '/assets/home-thumbnail-light.png'
              }
            />
          </Box>
          <Box
            sx={{
              maxHeight: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
              position: 'absolute',
              right: 0,
              top: 40,
              '& > div': {
                height: 460,
                width: 560,
              },
            }}
          >
            <HomeCodeSamples />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
