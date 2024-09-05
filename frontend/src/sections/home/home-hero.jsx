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
import React, {useState, useEffect, useCallback} from 'react';
import Chip from "@mui/material/Chip";
import {TrendingUp} from "@mui/icons-material";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import {GridListPlaceholder} from "../components/grid-lists/grid-list-placeholder";
import TablePagination from "@mui/material/TablePagination";
import TypingEffect from "./TypingEffect";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import Grid from "@mui/material/Grid";
import {FilterLines} from "@untitled-ui/icons-react";
import {MultiSelect} from "../../components/multi-select";
import {useDispatch, useSelector} from "../../store";
import {setCurrentPage, setSort, setSubjectId} from "../../slices/home";
import {useNavigate} from "react-router";
import {formatDistanceToNowStrict, parseISO} from "date-fns";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import { useLocation } from 'react-router-dom';



export const HomeHero = () => {

  const dispatch = useDispatch();

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
      console.log('DDD')
      setTimeout(() => {
        window.scrollTo({
          top: 280,
          behavior: 'smooth'
        });
      }, 100);
    };

  const theme = useTheme();
  const filterOptions = [
    {
      label: 'Noi',
      value: 'CREATED.DESC',
    },
    {
      label: 'Ieftine',
      value: 'PRICE.ASC',
    },
    {
      label: 'Scumpe',
      value: 'PRICE.DESC',
    },
  ];

  const subjects = {
    'Limba engleză': 30,
    'Matematică': 8,
    'Limba franceză': 32,
    'Informatică': 6,
    'Biologie': 18,
    'Limba germană': 33,
    'Chimie': 2,
    'Limba și literatură română': 24,
    'Fizică': 5
  };

  const subjectNames = Object.keys(subjects);


  const [size, setSize] = useState(12);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState('');

  const searchParams = new URLSearchParams(location.search);

  const pageParam = parseInt(searchParams.get('page'), 10);
  const subjectIdParam = parseInt(searchParams.get('q'), 10);
  const sortParam = searchParams.get('sort');
  const scrollParam = parseInt(searchParams.get('scroll'), 10);

  // Initialize state with values from URL parameters or default values
  const [page, setPage] = useState(isNaN(pageParam) ? 0 : pageParam);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectIdParam || null);
  const [selectedFilter, setSelectedFilter] = useState(sortParam ? [sortParam] : [filterOptions[0].value]);



  const handleSearchTextUpdate = (selectedValue) => {
    if (selectedValue !== searchText) {
      setSearchText(selectedValue);
    }
  };


  async function enhanceAnnouncementsWithImages(announcements) {
    return await Promise.all(announcements.map(async (announcement) => {
      try {
        const imageResponse = await axios.get(`${apiBaseUrl}/api/user/${announcement.tutorId}/profile-image`, {responseType: 'blob'});
        const imageUrl = URL.createObjectURL(imageResponse.data);
        return {...announcement, tutorImage: imageUrl};
      } catch (error) {
        console.error('Error fetching tutor image:', error);
        return {...announcement, tutorImage: null};
      }
    }));
  }

  const handleChipClick = useCallback((subjectName) => {
    const subjectId = subjects[subjectName];
    if (subjectId && subjectName !== searchText) {
      setSearchText(subjectName);
      handleSubjectSelect({
        id: subjectId,
        name: subjectName
      })
    }
  });

  const handleSubjectSelect = async (val) => {
    if (searchText === val.name || val.id === undefined) {
      return;
    }

    setIsLoading(true);
    setSelectedFilter([filterOptions[0].value]);
    setPage(0);
    setSelectedSubjectId(val.id);
    try {
      const response = await axios.get(`${apiBaseUrl}/api/announcement/paginated?subjectId=${val.id}`);
      const announcementWithImages = await enhanceAnnouncementsWithImages(response.data.content);
      setProjects(announcementWithImages);
      setTotalItems(response.data.totalElements);

    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    setIsLoading(false);
  };

  const fetchAndSetProjects = useCallback(async () => {
    setIsLoading(true);
    const selectedSort = selectedFilter.length > 0 ? selectedFilter[0] : filterOptions[0].value;
    let apiUrl = `${apiBaseUrl}/api/announcement/paginated?page=${page}&size=${size}&sort=${selectedSort}`;

    // const subjectId = subjects[searchText];
    if (selectedSubjectId) {
      apiUrl += `&subjectId=${selectedSubjectId}`;
    }

    try {
      const response = await axios.get(apiUrl);
      const announcementWithImages = await enhanceAnnouncementsWithImages(response.data.content);
      if (selectedSubjectId) {
        console.log('only one time')
        setSearchText(response.data.content[0].subject)
      }
      setProjects(announcementWithImages);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    setIsLoading(false);
  }, [page, selectedFilter]);

  const handleFilterChange = (newValues) => {
    if (newValues.length === 0) {
      return;
    }
    setPage(0);
    const lastSelectedValue = newValues[newValues.length - 1];
    setSelectedFilter([lastSelectedValue]);
  };

  const resetSearch = async () => {
    setSelectedSubjectId(null)
    setSearchText('');
    setSelectedFilter([filterOptions[0].value]);
    setPage(0);
    // await fetchAndSetProjects();
  };

  useEffect(() => {
    fetchAndSetProjects();
    console.log('asfd')

  }, [fetchAndSetProjects]);



  const selectedOptionLabel = () => {
    const foundOption = filterOptions.find(option => selectedFilter.includes(option.value));
    return foundOption ? foundOption.label : 'Default Label';
  };

  const navigate = useNavigate();

  const handleCardClick = (id) => {

    navigate(`/announcement/${id}`, {
      state: {
        page: page,
        selectedSubjectId: selectedSubjectId,
        selectedFilter: selectedFilter,
        scrollPosition: window.scrollY
      }
    });
  };


  useEffect(() => {
    console.log("xxxxxxxxxx")
    console.log(scrollParam)
    if (!isNaN(scrollParam)) {
      window.scrollTo(0, scrollParam);
    }
  }, [scrollParam]);


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
            sx={{mb: 1, mt: 1, textAlign: 'center'}}
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
              <TrendingUp/>
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
                    backgroundColor: 'grey.400',
                  },
                }}
              />
            ))}
          </Stack>

          {searchText && (
            <Grid container spacing={2} alignItems="center" mb={3} justifyContent="space-between">
              <Grid item xs={6} md={3}>
                <Stack direction="row" alignItems="center" >
                  <SvgIcon>
                    <SearchMdIcon/>
                  </SvgIcon>
                  {/*<Typography color="text.secondary"*/}
                  {/*            sx={{fontSize: 18, fontWeight: 'bold', marginLeft: 0}}>*/}
                  {/*  Termeni:*/}
                  {/*</Typography>*/}
                  <Chip
                    label={
                      <Box sx={{alignItems: 'center', display: 'flex'}}>
                        <span>{searchText}</span>
                      </Box>
                    }
                    onDelete={resetSearch}
                    sx={{m: 1}}
                    variant="outlined"
                  />


                </Stack>
              </Grid>

              <Grid item xs={6} md={3}>
                <Stack direction="row" alignItems="center"
                       sx={{float: 'right'}}>
                  <SvgIcon>
                    <FilterLines/>
                  </SvgIcon>
                  {/*<Typography color="text.secondary" sx={{fontSize: 18, fontWeight: 'bold'}}>*/}
                  {/*  Filtru:*/}
                  {/*</Typography>*/}

                  <MultiSelect
                    label={selectedOptionLabel()}
                    options={filterOptions}
                    value={selectedFilter}
                    onChange={handleFilterChange}
                  />

                </Stack>
              </Grid>


            </Grid>
          )}


          <Container maxWidth="lg">
            <Stack spacing={8}>

              {(isLoading || projects.length === 0) ? (
                <Box sx={{position: 'relative', height: '100%'}}>
                  <GridListPlaceholder listLength={size}/>
                  <Box sx={{
                    position: 'fixed',
                    top: '57.5%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}>
                    <CircularProgress size={40} thickness={6} style={{opacity: 0.7}}/>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    // backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50'),
                    // p: 3,
                  }}
                >
                  <Grid
                    container
                    spacing={3}
                  >
                    {projects.map((announcement) => {
                      const updatedAgo = formatDistanceToNowStrict(parseISO(announcement.createdDate), {addSuffix: true});

                      return (
                        <Grid
                          key={announcement.id}
                          item
                          // xs={12}
                          // md={12}
                          xs={12}      // Full width on extra small screens
                          sm={6}       // Half width on small screens (600px and up)
                          md={4}       // Half width on medium screens (960px and up)
                        >
                          <Card
                            onClick={() => handleCardClick(announcement.id)}
                            id={announcement.id}
                            sx={{
                              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              position: 'relative',
                              // padding: '1rem',
                              border:  (theme) => (theme.palette.mode === 'light' ? '1px solid whitesmoke' : '1px solid rgb(47, 79, 79)'),
                              '&:hover': {
                                border: (theme) => (theme.palette.mode === 'light' ? '1px solid #6C737F' : '1px solid whitesmoke'),
                                borderRadius: '20px',
                              },
                            }}
                          >
                            {announcement.promoted && <PromotedChip />}
                            <Box sx={{p: 2, boxShadow: 'unset', padding: '8px 16px 16px'}}>

                              <Box
                                sx={{
                                  alignItems: 'center',
                                  display: 'flex',
                                  mt: 2
                                }}
                              >
                                <Avatar src={announcement.tutorImage}/>
                                <Box sx={{ml: 2, boxShadow: 'unset',
                                  paddingRight: announcement.promoted ? '2.5rem' : '0.5rem',
                                  maxHeight: '4rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',}}>
                                  <Link
                                    color="text.primary"
                                    variant="h6"
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {announcement.title}
                                  </Link>
                                  <Typography color="text.secondary" variant="body2">
                                    de{' '}
                                    <Typography component="span" color="text.primary" variant="subtitle2">
                                      {announcement.tutorName}
                                    </Typography>
                                  {/*  {' '}| Actualizat acum {updatedAgo*/}
                                  {/*  .replace('days ago','zile')*/}
                                  {/*  .replace('months ago','luni')*/}
                                  {/*  .replace('years ago','ani')*/}
                                  {/*  .replace('day ago','zi')*/}
                                  {/*  .replace('month ago','luna')*/}
                                  {/*  .replace('year ago','an')*/}
                                  {/*}*/}
                                  </Typography>

                                </Box>
                              </Box>
                            </Box>
                            <Box>
                              <Typography
                                color="text.secondary"
                                variant="body2"
                                sx={{
                                  pb: 2,
                                  px: 3,
                                  maxHeight: '4rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',

                                }}
                              >
                                {announcement.description}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                px: 3,
                                py: 2,
                              }}
                            >
                              <Stack
                                alignItems="center"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                              >
                                <div>
                                  <Typography color="primary.main" variant="subtitle2">{announcement.price} lei
                                    / oră</Typography>
                                </div>
                                <div>

                                  <Typography color="primary.main"
                                              variant="subtitle2">{announcement.subject}</Typography>
                                </div>
                              </Stack>
                            </Box>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}

              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                {totalItems && (
                  <TablePagination
                    labelRowsPerPage="Anunțuri"
                    component="div"
                    count={totalItems}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={size}
                    labelDisplayedRows={({ page, count }) => {
                      const totalNumberOfPages = Math.ceil(count / size);
                      return `Pagina ${page + 1} din ${totalNumberOfPages}`;
                    }}
                    rowsPerPageOptions={[]}
                  />
                )}

              </Box>

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
                  <EyeIcon/>
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
              sx={{my: 3}}
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
                sx={{fontWeight: 700}}
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
                  <LayoutBottomIcon/>
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
            <HomeCodeSamples/>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};



const PromotedChip = () => {
  return (

    <Box
      sx={{
        position: 'absolute',
        top: 20,
        right: 20,
        color: 'white',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #D4AF37, #FFD700)', // Shiny gradient background
        backgroundSize: '200% 200%',
        backgroundPosition: '50% 50%',
        borderRadius: '50%', // Make the box circular
        width: '2rem',      // Set a specific width
        height: '2rem',     // Set a specific height to match the width
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2), inset 0 -2px 10px rgba(255, 255, 255, 0.4)', // Inner and outer shadows
        opacity: 0.9,
        transition: 'background-position 1s ease', // Smooth transition for hover effect
        '&:hover': {
          backgroundPosition: '100% 0', // Hover effect for the shine
        },
      }}
    >
      <svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
           viewBox="0 0 47.94 47.94" xmlSpace="preserve">
        <path fill="white" d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
          c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
          c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
          c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
          c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
          C22.602,0.567,25.338,0.567,26.285,2.486z"/>
      </svg>
    </Box>
  );
};

