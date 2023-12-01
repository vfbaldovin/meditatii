import EyeIcon from '@untitled-ui/icons-react/build/esm/Eye';
import LayoutBottomIcon from '@untitled-ui/icons-react/build/esm/LayoutBottom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import {useTheme} from '@mui/material/styles';
import {CourseSearch} from 'src/sections/dashboard/academy/course-search';

import {RouterLink} from 'src/components/router-link';
import {paths} from 'src/paths';

import {HomeCodeSamples} from './home-code-samples';
import React, { useState, useEffect, useCallback } from 'react';
import Chip from "@mui/material/Chip";
import {TrendingUp} from "@mui/icons-material";
import {GridList2} from "../components/grid-lists/grid-list-2";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import {GridListPlaceholder} from "../components/grid-lists/grid-list-placeholder";
import TablePagination from "@mui/material/TablePagination";
import TypingEffect from "./TypingEffect";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import Slider from "react-slick";


export const HomeHero = () => {
  const theme = useTheme();
  const subjects = {
    'Limba engleză': 30,
    'Matematică': 8,
    'Limba franceză': 32,
    'Informatică': 6,
    'Biologie': 18,
    'Limba germană': 33,
    'Chimie': 2,
    'Limbă și literatură română': 24,
    'Fizică': 5
  };

  const subjectNames = Object.keys(subjects);

  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchTextUpdate = (selectedValue) => {
    if (selectedValue !== searchText) {
      setSearchText(selectedValue);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChipClick = useCallback((subjectName) => {
    const subjectId = subjects[subjectName];
    if (subjectId && subjectName !== searchText) {
      setSearchText(subjectName);
      handleSubjectSelect(subjectId);
    }
  });

  async function enhanceAnnouncementsWithImages(announcements) {
    return await Promise.all(announcements.map(async (announcement) => {
      try {
        const imageResponse = await axios.get(`${apiBaseUrl}/user/${announcement.tutorId}/profile-image`, {responseType: 'blob'});
        const imageUrl = URL.createObjectURL(imageResponse.data);
        return {...announcement, tutorImage: imageUrl};
      } catch (error) {
        console.error('Error fetching tutor image:', error);
        return {...announcement, tutorImage: null};
      }
    }));
  }

  const handleSubjectSelect = async (subjectId) => {
    if (subjects[searchText] === subjectId) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/announcement/paginated?subjectId=${subjectId}`);
      const announcementWithImages = await enhanceAnnouncementsWithImages(response.data.content);
      setProjects(announcementWithImages);
      setTotalItems(response.data.totalElements);

    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${apiBaseUrl}/announcement/paginated?page=${page}&size=${size}`);
        const announcementWithImages = await enhanceAnnouncementsWithImages(response.data.content);
        setProjects(announcementWithImages);
        setTotalItems(response.data.totalElements);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
      setIsLoading(false);
    };

    fetchProjects();

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
            sx={{ mb: 1, mt:1, textAlign: 'center'}}
          >
            Învață sau oferă pregătire la&nbsp;
          </Typography>

          <TypingEffect subjectNames={subjectNames}/>

          <Box mb={3} display='flex' justifyContent='center' alignItems='center'>
            <CourseSearch
              onUpdateSearchText={handleSearchTextUpdate}
              onSubjectSelect={handleSubjectSelect}
              searchTextDefault={searchText}/>
          </Box>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            mb={3}
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              '& > *': {
                marginBottom: '8px',
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

            {subjectNames.map((subjectName) => (
              <Chip
                label={subjectName}
                key={subjectName}
                onClick={() => handleChipClick(subjectName)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'grey.400', // Adjust this color as needed
                  },
                }}
              />
            ))}
          </Stack>

          {searchText && ( // Conditional rendering based on searchText
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              mb={3}
              sx={{
                flexWrap: 'wrap',
                gap: 1,
                '& > *': {
                  marginBottom: '8px',
                },
              }}
            >
              <SvgIcon sx={{marginBottom: 'unset'}}>
                <SearchMdIcon />
              </SvgIcon>
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginLeft: 0
                }}
              >
                Termeni:
              </Typography>
              <Chip label={searchText} />

            </Stack>
          )}



            <Container maxWidth="lg">
              <Stack spacing={8}>

                {isLoading ? (
                  <Box sx={{ position: 'relative', height: '100%' }}>
                    <GridListPlaceholder listLength={size}/>
                    <Box sx={{
                      position: 'fixed',
                      top: '57.5%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}>
                      <CircularProgress size={40} thickness={6} style={{ opacity: 0.7 }}/>
                    </Box>
                  </Box>
                ) : (
                  <GridList2 projects={projects} />
                )}

                <TablePagination
                  component="div"
                  count={totalItems}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={size}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />

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
