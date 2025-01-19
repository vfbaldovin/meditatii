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
import {ListingBio} from "../../sections/listing/listing-bio";
import {useLocation} from "react-router-dom";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import ContactDialog from "./contact-dialog";
import {QuillEditor} from "../../components/quill-editor";

const Page = () => {
  const theme = useTheme();
  const {id} = useParams();
  const [listing, setListing] = useState({
    title: '',
    description: '',
    tutorName: '',
    age: null,
    subject: '',
    price: 0,
    tutorId: '',
    createdDate: '',
    updatedDate: '',
  });

  const [tutorImageUrl, setTutorImageUrl] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/listing/${id}`);
        setListing(response.data);

        const imageResponse = await axios.get(`${apiBaseUrl}/api/user/${response.data.tutorId}/profile-image`, {responseType: 'blob'});
        const imageUrl = URL.createObjectURL(imageResponse.data);
        setTutorImageUrl(imageUrl);
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };

    fetchListing();
  }, [id]);

  const navigate = useNavigate();
/*  const currentPage = useSelector((state) => state.home.currentPage);
  const subjectId = useSelector((state) => state.home.subjectId);
  const sort = useSelector((state) => state.home.sort);*/
  let location = useLocation();
  const goBack = () => {
    let page = location.state?.page;
    let selectedSubjectId = location.state?.selectedSubjectId;
    let selectedFilter = location.state?.selectedFilter;
    let scrollPosition = location.state?.scrollPosition;
    if (page === undefined || selectedSubjectId === undefined || selectedFilter === undefined) {
      navigate(`/`);
    } else {
      navigate(`/?page=${page}&q=${selectedSubjectId}&sort=${selectedFilter}&scroll=${scrollPosition}`);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  usePageView();

  return (
    <>
      <Seo title={`Anunț - ${listing?.subject}`}/>
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={1}>
            <Box className='up-spacing' sx={{
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
              pt: {
                xs: '6rem',
                sm: '6rem',
                md: '7rem',
                lg: '7rem',
              }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 2 }}>
                <Typography className='bck-btn' onClick={goBack} sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}>
                  <SvgIcon style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                    <ArrowNarrowLeft/>
                  </SvgIcon>
                  {location.state?.selectedSubjectId
                    ? listing.subject
                    : 'Înapoi'}
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
                <Box sx={{
                  textAlign: 'center'
                }}>
                  <Avatar
                    src={tutorImageUrl}
                    sx={{
                      marginLeft: 'auto',
                      marginRight: 'auto',
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
                    {listing.tutorName}
                  </Typography>

                </Box>


                <ListingBio listing={listing}/>

              </Grid>
              <Grid
                xs={12}
                lg={9}
              >
                <Grid
                  container
                  spacing={4}
                  direction="column"
                  className="largeScreenAvatar2"
                >
                  <Grid xs={12} lg={9}>
                    <Typography variant="h4">
                      {listing.subject}
                    </Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    lg={9}
                    sx={{
                      paddingTop: 'unset',
                    }}
                  >
                    <Chip
                      label={
                        <span>
        <strong>Preț:</strong> {listing.price} lei
      </span>
                      }
                      key="price"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'grey.400',
                        },
                        marginRight: 1,
                        marginBottom: 1, // Add vertical spacing
                      }}
                    />

                    <Chip
                      label={
                        <span>
        <strong>Experiență:</strong> {listing.experience} ani
      </span>
                      }
                      key="experience"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'grey.400',
                        },
                        marginRight: 1,
                        marginBottom: 1, // Add vertical spacing
                      }}
                    />

                    <Chip
                      label={
                        <span>
        <strong>Vârstă:</strong> {listing.age} ani
      </span>
                      }
                      key="age"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'grey.400',
                        },
                        marginBottom: 1, // Add vertical spacing
                      }}
                    />

                    <Typography
                      variant="body1"
                      sx={{ padding: 2, whiteSpace: 'pre-wrap' }}
                    >
                      {listing.description}
                    </Typography>
                  </Grid>
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
