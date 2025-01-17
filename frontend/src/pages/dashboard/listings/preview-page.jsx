import React, {useState, useEffect} from 'react';
import {useParams, useLocation} from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EastIcon from '@mui/icons-material/East';
import {Seo} from 'src/components/seo';
import {useAuth} from 'src/hooks/use-auth';
import {ListingCard} from "./steps/listing-card";
import Grid from "@mui/material/Unstable_Grid2";
import confetti from "canvas-confetti";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import CheckIcon from '@mui/icons-material/Check';
import CardContent from "@mui/material/CardContent";
import SvgIcon from "@mui/material/SvgIcon";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import {useTheme} from "@mui/material/styles";
import Link from "@mui/material/Link";
import {RouterLink} from "../../../components/router-link";
import {paths} from "../../../paths";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";

const PreviewPage = () => {
  const {id} = useParams();
  const {search} = useLocation();
  const {fetchWithAuth} = useAuth();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(false);
  const theme = useTheme();

  const wallpapers = [
    // 'url(/assets/writing.webp)',
    'url(/assets/oai_arco_thumbnail.jpg)',

  ];
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  const handleBackgroundChange = () => {
    setCurrentWallpaperIndex((prevIndex) =>
      (prevIndex + 1) % wallpapers.length
    );
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetchWithAuth(`/api/dashboard/listings/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch listing');
        }

        const data = await response.json();
        setListing(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [id, fetchWithAuth]);

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

  // Parse query parameters
  const queryParams = new URLSearchParams(search);
  const isNew = queryParams.get('s') === 'new';

  if (isLoading) {
    return (
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Seo title={`Anunț - ${listing?.subject}`}/>

      <Box
        component="main"
        sx={{
          display: 'flex',
          flexGrow: 1,
        }}
      >
        <Grid
          container
          sx={{flexGrow: 1}}
        >
          <Grid
            xs={12}
            sm={4}
            // onClick={handleBackgroundChange}
            sx={{
              backgroundImage: wallpapers[currentWallpaperIndex],
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              display: {
                xs: 'none',
                md: 'block',
              },
              // cursor: 'pointer',
            }}
          />
          <Grid
            xs={12}
            md={8}
            sx={{
              p: {
                xs: 4,
                sm: 6,
                md: 8,
              },
            }}
          >

            <Stack maxWidth="sm"
                   spacing={2}
            >
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.dashboard.index}
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                  }}
                  underline="hover"
                >
                  <SvgIcon sx={{mr: 1}}>
                    <ArrowLeftIcon/>
                  </SvgIcon>
                  <Typography variant="subtitle2">Înapoi</Typography>
                </Link>
              </div>
              <Typography variant="h4" sx={{mt:0}}>
                Anunț • {listing.subject}
              </Typography>
              {isNew && (

                <Typography variant="h6" sx={{mt: 2}}>
                  Felicitări, anunțul tău a fost listat cu succes!{' '}
                  <span
                    role="button"
                    style={{cursor: 'pointer'}}
                    onClick={triggerConfetti}
                  >
                🎉
              </span>
                </Typography>

              )}
              <Typography variant="h5">
                Promovare
              </Typography>
              <Box sx={{mt: 0}}>
                <Typography variant="h6" sx={{margin: 0}}>
                  Promovează-ți anunțul pentru vizibilitate maximă.
                </Typography>
                {/*<Typography variant="body1" sx={{ margin: 0 }}>*/}
                {/*  Apare pe prima pagină a site-ului și este vizibil înainte ca utilizatorii să înceapă căutarea.*/}
                {/*</Typography>*/}
              </Box>
              <Grid container spacing={2}>
                {/* First Card */}
                <Grid item container alignItems="center">
                  <Card
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    sx={{
                      borderColor: 'inherit',
                      borderWidth: 1,
                      // cursor: 'pointer',
                      // border: (theme) => (theme.palette.mode === 'light' ? '1px solid whitesmoke' : '2px solid rgb(47, 79, 79)'),
                      '&:hover': {
                        boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.25)', // Add a shadow effect on hover

                        // border: (theme) => (theme.palette.mode === 'light' ? '1px solid ' + theme.palette.primary.main : '2px solid whitesmoke'),
                        // borderRadius: '20px',
                      },
                    }}
                    variant="outlined"
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex", // Arrange children horizontally
                          flexDirection: "row", // Align children in a row
                          alignItems: "flex-start", // Align items to the top
                          justifyContent: "flex-start", // Align items to the left
                          gap: "8px", // Optional: Add space between the elements
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex", // Use flexbox for alignment
                            flexDirection: "row", // Align items in a row
                            alignItems: "flex-end", // Align items to the bottom
                            position: "relative", // Needed for pseudo-element adjustments
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex", // Use flexbox for the parent
                              flexDirection: "column", // Align children vertically
                              justifyContent: "flex-end", // Push children to the bottom
                              // alignItems: "center", // Center horizontally
                              height: "100%", // Ensure it takes the full height of the parent
                              position: "relative", // Needed for child position adjustments
                              margin: "auto",
                            }}
                          >
                            <Box
                              sx={{
                                position: "relative", // For pseudo-element positioning
                                display: "flex", // Use flexbox for alignment inside the box
                                // justifyContent: "center", // Center horizontally
                                alignItems: "flex-end", // Align content to the bottom
                                margin: "auto",
                                "&::after": {
                                  content: '""',
                                  position: "absolute",
                                  top: "50%", // Middle of the text vertically
                                  left: 0, // Start from the left of the text
                                  width: "100%", // Span the entire width of the text
                                  height: "2px", // Thickness of the line
                                  backgroundColor: "error.main", // Color of the oblique line
                                  transform: "rotate(-20deg)", // Create the diagonal effect
                                  transformOrigin: "center", // Keep it centered
                                },
                              }}
                            >
                              <Typography
                                variant="h5"
                                component="span"
                                sx={{fontWeight: "bold", color: "error.main"}}
                              >
                                30
                              </Typography>
                              <Typography
                                variant="h6"
                                component="span"
                                sx={{fontWeight: "bold", color: "error.main", ml: 0.5}}
                              >
                                lei/lună
                              </Typography>
                            </Box>
                          </Box>


                          <Typography
                            variant="h4"
                            sx={{
                              ml: '4px',
                              fontWeight: "bold",
                              // textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                            }}
                          >10</Typography>
                          <Typography
                            // color="text.secondary"
                            sx={{
                              ml: '4px',
                              mt: 'auto',
                              fontWeight: "bold",
                              // textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                            }}
                            variant="h5"
                          >
                            lei/lună
                          </Typography>
                        </Box>
                      </Box>
                      {/*<Typography*/}
                      {/*  color="text.secondary"*/}
                      {/*  sx={{ mt: 1 }}*/}
                      {/*  variant="body2"*/}
                      {/*>*/}
                      {/*  Promovează-ți anunțul pentru vizibilitate maximă! 🏆*/}
                      {/*</Typography>*/}
                      <Grid item container alignItems="center" sx={{mt: 1}}>
                        <Box>
                          <Box display="flex" alignItems="center">
                            <CheckIcon sx={{color: 'success.main', mr: 1}}/>
                            <Typography variant="body2">poziție prioritară</Typography>
                          </Box>
                          <Box display="flex" alignItems="center">
                            <CheckIcon sx={{color: 'success.main', mr: 1}}/>
                            <Typography variant="body2">reactualizări automate</Typography>
                          </Box>
                          {/*<Box display="flex" alignItems="center">*/}
                          {/*  <CheckIcon sx={{color: 'success.main', mr: 1}}/>*/}
                          {/*  <Typography variant="body2">*/}
                          {/*    recomandare către elevii noi*/}
                          {/*  </Typography>*/}
                          {/*</Box>*/}
                          <Box display="flex" alignItems="center">
                            <CheckIcon sx={{color: 'success.main', mr: 1}}/>
                            <Typography variant="body2">
                              meditator verificat permanent
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Box
                        sx={{
                          mt: 2,               // Maintain top margin
                          display: 'flex',      // Use flexbox
                          justifyContent: 'center', // Center horizontally
                        }}
                      >
                        <Button
                          color='inherit'
                          endIcon={
                            <SvgIcon>
                              <ArrowRightIcon/>
                            </SvgIcon>
                          }
                          variant="outlined"
                        >
                          Plată card&nbsp;
                          <svg
                            style={{zoom: '70%'}}

                            xmlns="http://www.w3.org/2000/svg" width="145.341"
                            height="24.675" viewBox="0 0 145.341 24.675">
                            <g id="Group_14572" data-name="Group 14572"
                               transform="translate(-52 -10567)">
                              <path id="path3789"
                                    d="M40.134.5c-4.321,0-8.182,2.239-8.182,6.377,0,4.745,6.848,5.073,6.848,7.457,0,1-1.15,1.9-3.115,1.9a10.343,10.343,0,0,1-4.872-1.255l-.892,4.175a15.207,15.207,0,0,0,5.588,1.06c4.724,0,8.441-2.349,8.441-6.558,0-5.014-6.876-5.332-6.876-7.545,0-.786.944-1.648,2.9-1.648a9.868,9.868,0,0,1,4.014.913l.873-4.033A13.06,13.06,0,0,0,40.134.5ZM.6.8l-.1.609a20.321,20.321,0,0,1,3.455,1c2.108.761,2.258,1.2,2.613,2.58L10.437,19.9h5.186L23.611.8H18.438L13.3,13.789,11.209,2.783A2.264,2.264,0,0,0,8.853.8H.6ZM25.692.8,21.633,19.9h4.934L30.612.8h-4.92ZM53.209.8a2.328,2.328,0,0,0-2.283,1.75L43.7,19.9h5.174l1-2.891h6.3l.609,2.891h4.565L57.368.8H53.209Zm.673,5.16,1.534,7.166H51.307Z"
                                    transform="translate(135.99 10568.5)" fill="#1434cb"></path>
                              <g id="mastercard" transform="translate(52 10567)">
                                <g id="Group_14571" data-name="Group 14571"
                                   transform="translate(0 0)">
                                  <g id="Group_14567" data-name="Group 14567"
                                     transform="translate(1.614 20.886)">
                                    <path id="Path_5048" data-name="Path 5048"
                                          d="M-156.226-18.32v.064h.059a.062.062,0,0,0,.032-.008.028.028,0,0,0,.012-.024.027.027,0,0,0-.012-.024.057.057,0,0,0-.032-.008Zm.06-.045a.11.11,0,0,1,.071.021.068.068,0,0,1,.025.056.064.064,0,0,1-.02.049.1.1,0,0,1-.057.024l.079.09h-.061l-.073-.09h-.024v.09h-.051v-.24Zm-.016.323a.19.19,0,0,0,.078-.016.2.2,0,0,0,.064-.043.2.2,0,0,0,.043-.064.205.205,0,0,0,.016-.079.205.205,0,0,0-.016-.079.207.207,0,0,0-.043-.064.2.2,0,0,0-.064-.043.2.2,0,0,0-.078-.015.208.208,0,0,0-.079.015.2.2,0,0,0-.065.043.2.2,0,0,0-.042.064.194.194,0,0,0-.016.079.194.194,0,0,0,.016.079.189.189,0,0,0,.042.064.2.2,0,0,0,.065.043.2.2,0,0,0,.079.016m0-.461a.259.259,0,0,1,.1.021.261.261,0,0,1,.084.055.254.254,0,0,1,.056.082.247.247,0,0,1,.021.1.247.247,0,0,1-.021.1.268.268,0,0,1-.056.082.283.283,0,0,1-.084.055.259.259,0,0,1-.1.021.263.263,0,0,1-.1-.021.271.271,0,0,1-.084-.055.268.268,0,0,1-.056-.082.247.247,0,0,1-.021-.1.247.247,0,0,1,.021-.1.254.254,0,0,1,.056-.082.251.251,0,0,1,.084-.055.263.263,0,0,1,.1-.021m-24.285-.924a.781.781,0,0,1,.79-.833.78.78,0,0,1,.784.833.78.78,0,0,1-.784.833.781.781,0,0,1-.79-.833m2.107,0v-1.3h-.566v.316a.987.987,0,0,0-.822-.381,1.3,1.3,0,0,0-1.3,1.367,1.3,1.3,0,0,0,1.3,1.367.987.987,0,0,0,.822-.381v.316h.566Zm19.126,0a.781.781,0,0,1,.79-.833.78.78,0,0,1,.784.833.78.78,0,0,1-.784.833.781.781,0,0,1-.79-.833m2.108,0v-2.347h-.567v1.361a.987.987,0,0,0-.822-.381,1.3,1.3,0,0,0-1.3,1.367,1.3,1.3,0,0,0,1.3,1.367.987.987,0,0,0,.822-.381v.316h.567Zm-14.209-.86a.647.647,0,0,1,.659.631h-1.351a.67.67,0,0,1,.692-.631m.011-.507a1.272,1.272,0,0,0-1.3,1.367,1.284,1.284,0,0,0,1.335,1.367,1.582,1.582,0,0,0,1.067-.365l-.277-.419a1.245,1.245,0,0,1-.757.272.723.723,0,0,1-.779-.638h1.933c.006-.07.011-.141.011-.218a1.248,1.248,0,0,0-1.236-1.367m6.834,1.367a.781.781,0,0,1,.79-.833.78.78,0,0,1,.784.833.78.78,0,0,1-.784.833.781.781,0,0,1-.79-.833m2.107,0v-1.3h-.566v.316a.988.988,0,0,0-.822-.381,1.3,1.3,0,0,0-1.3,1.367,1.3,1.3,0,0,0,1.3,1.367.988.988,0,0,0,.822-.381v.316h.566Zm-5.3,0A1.315,1.315,0,0,0-166.3-18.06a1.363,1.363,0,0,0,.936-.31l-.272-.458a1.144,1.144,0,0,1-.681.234.778.778,0,0,1-.784-.833.778.778,0,0,1,.784-.833,1.144,1.144,0,0,1,.681.234l.272-.458a1.363,1.363,0,0,0-.936-.31,1.315,1.315,0,0,0-1.389,1.367m7.3-1.367a.768.768,0,0,0-.686.381v-.316h-.561v2.6h.567v-1.459c0-.431.185-.67.555-.67a.918.918,0,0,1,.354.065l.175-.534a1.205,1.205,0,0,0-.4-.071m-15.172.272a1.947,1.947,0,0,0-1.062-.272c-.659,0-1.084.316-1.084.833,0,.424.316.686.9.768l.267.038c.31.044.457.125.457.272,0,.2-.207.316-.593.316a1.386,1.386,0,0,1-.866-.272l-.267.441a1.878,1.878,0,0,0,1.127.338c.752,0,1.187-.354,1.187-.85,0-.458-.343-.7-.909-.779l-.267-.039c-.245-.032-.441-.081-.441-.256,0-.191.185-.3.5-.3a1.679,1.679,0,0,1,.812.223Zm7.3-.272a.767.767,0,0,0-.686.381v-.316h-.561v2.6h.566v-1.459c0-.431.185-.67.555-.67a.918.918,0,0,1,.354.065l.175-.534a1.205,1.205,0,0,0-.4-.071m-4.83.065h-.926v-.79h-.572v.79h-.528v.517h.528v1.187c0,.6.234.964.9.964a1.328,1.328,0,0,0,.708-.2l-.163-.485a1.048,1.048,0,0,1-.5.147c-.283,0-.375-.175-.375-.436v-1.176h.926Zm-8.463,2.6v-1.634a.969.969,0,0,0-1.024-1.035,1.008,1.008,0,0,0-.915.463.955.955,0,0,0-.86-.463.861.861,0,0,0-.762.386v-.321h-.567v2.6h.572v-1.443a.609.609,0,0,1,.638-.692c.376,0,.566.245.566.686v1.449h.572v-1.443a.614.614,0,0,1,.637-.692c.386,0,.572.245.572.686v1.449Z"
                                          transform="translate(185.679 21.774)"
                                          fill="#231f20"></path>
                                  </g>
                                  <g id="Group_14568" data-name="Group 14568"
                                     transform="translate(30.589 15.498)">
                                    <path id="Path_5049" data-name="Path 5049"
                                          d="M-4.381-2.017V-2.4h-.1l-.115.261L-4.709-2.4h-.1v.38h.07V-2.3l.107.247h.073l.107-.248v.287Zm-.629,0v-.315h.127V-2.4h-.324v.064h.127v.315Z"
                                          transform="translate(5.207 2.397)" fill="#f79410"></path>
                                  </g>
                                  <path id="Path_5050" data-name="Path 5050"
                                        d="M3351.582,2162.988H3343v-15.416h8.578Z"
                                        transform="translate(-3331.436 -2145.474)"
                                        fill="#ff5f00"></path>
                                  <g id="Group_14569" data-name="Group 14569"
                                     transform="translate(0 0)">
                                    <path id="Path_5051" data-name="Path 5051"
                                          d="M-64.275-52a9.788,9.788,0,0,1,3.744-7.708,9.761,9.761,0,0,0-6.059-2.1,9.8,9.8,0,0,0-9.8,9.8,9.8,9.8,0,0,0,9.8,9.8,9.761,9.761,0,0,0,6.059-2.1A9.788,9.788,0,0,1-64.275-52"
                                          transform="translate(76.392 61.809)"
                                          fill="#eb001b"></path>
                                  </g>
                                  <g id="Group_14570" data-name="Group 14570"
                                     transform="translate(15.852 0)">
                                    <path id="Path_5052" data-name="Path 5052"
                                          d="M-84.139-52a9.8,9.8,0,0,1-9.8,9.8A9.764,9.764,0,0,1-100-44.3,9.786,9.786,0,0,0-96.256-52,9.786,9.786,0,0,0-100-59.713a9.764,9.764,0,0,1,6.059-2.1,9.8,9.8,0,0,1,9.8,9.8"
                                          transform="translate(100.001 61.809)"
                                          fill="#f79e1b"></path>
                                  </g>
                                </g>
                              </g>
                              <g id="maestro" transform="translate(94.205 10567)">
                                <path id="Path_5053" data-name="Path 5053"
                                      d="M101.986,32.364h-8.6V16.913h8.6Z"
                                      transform="translate(-81.79 -14.813)" fill="#6c6bbd"></path>
                                <path id="Path_5054" data-name="Path 5054"
                                      d="M12.145-148.407a9.81,9.81,0,0,1,3.753-7.725,9.783,9.783,0,0,0-6.072-2.1A9.826,9.826,0,0,0,0-148.407a9.826,9.826,0,0,0,9.825,9.826,9.783,9.783,0,0,0,6.072-2.1,9.81,9.81,0,0,1-3.753-7.725"
                                      transform="translate(0 158.233)" fill="#d32011"></path>
                                <path id="Path_5055" data-name="Path 5055"
                                      d="M143.9-148.407a9.826,9.826,0,0,1-9.825,9.826,9.786,9.786,0,0,1-6.073-2.1,9.808,9.808,0,0,0,3.753-7.725A9.808,9.808,0,0,0,128-156.132a9.786,9.786,0,0,1,6.073-2.1,9.826,9.826,0,0,1,9.825,9.826"
                                      transform="translate(-112.1 158.233)" fill="#0099df"></path>
                                <path id="Path_5056" data-name="Path 5056"
                                      d="M59.8-197.943a1.211,1.211,0,0,1,.4.071l-.175.535a.92.92,0,0,0-.355-.066c-.371,0-.557.24-.557.671v1.463H58.55v-2.609h.562v.317a.77.77,0,0,1,.688-.382Zm-2.1.584h-.928v1.179c0,.262.092.437.377.437a1.046,1.046,0,0,0,.5-.147l.164.485a1.331,1.331,0,0,1-.709.2c-.672,0-.906-.36-.906-.966v-1.189h-.53v-.519h.53v-.792h.573v.792H57.7v.519Zm-7.265.557a.672.672,0,0,1,.693-.633.648.648,0,0,1,.66.633Zm1.944.229a1.251,1.251,0,0,0-1.239-1.37,1.275,1.275,0,0,0-1.3,1.37A1.287,1.287,0,0,0,51.18-195.2a1.585,1.585,0,0,0,1.07-.365l-.279-.42a1.241,1.241,0,0,1-.758.273.725.725,0,0,1-.78-.638H52.37c.006-.071.011-.142.011-.218Zm2.494-.638a1.673,1.673,0,0,0-.813-.224c-.311,0-.5.115-.5.306,0,.174.2.224.442.256l.267.038c.568.082.911.322.911.781,0,.5-.437.852-1.189.852a1.882,1.882,0,0,1-1.13-.339l.267-.442a1.391,1.391,0,0,0,.868.273c.387,0,.595-.114.595-.317,0-.147-.147-.229-.459-.272l-.267-.038c-.584-.082-.9-.344-.9-.77,0-.519.426-.835,1.086-.835a1.95,1.95,0,0,1,1.064.273l-.246.459Zm7-.192a.859.859,0,0,0-.325.061.781.781,0,0,0-.26.172.8.8,0,0,0-.172.266.9.9,0,0,0-.062.34.9.9,0,0,0,.062.34.8.8,0,0,0,.172.266.781.781,0,0,0,.26.172.848.848,0,0,0,.325.061.846.846,0,0,0,.325-.061.781.781,0,0,0,.261-.172.8.8,0,0,0,.174-.266.9.9,0,0,0,.062-.34.9.9,0,0,0-.062-.34.8.8,0,0,0-.174-.266.78.78,0,0,0-.261-.172.857.857,0,0,0-.325-.061Zm0-.539a1.469,1.469,0,0,1,.562.106,1.365,1.365,0,0,1,.447.29,1.327,1.327,0,0,1,.3.436,1.388,1.388,0,0,1,.107.547,1.388,1.388,0,0,1-.107.547,1.329,1.329,0,0,1-.3.437,1.375,1.375,0,0,1-.447.29,1.481,1.481,0,0,1-.562.1,1.481,1.481,0,0,1-.562-.1,1.36,1.36,0,0,1-.445-.29,1.345,1.345,0,0,1-.294-.437,1.388,1.388,0,0,1-.107-.547,1.388,1.388,0,0,1,.107-.547,1.343,1.343,0,0,1,.294-.436,1.35,1.35,0,0,1,.445-.29,1.469,1.469,0,0,1,.562-.106Zm-14.753,1.37a.783.783,0,0,1,.792-.835.782.782,0,0,1,.786.835.782.782,0,0,1-.786.835.782.782,0,0,1-.792-.835Zm2.112,0v-1.3h-.567v.317a.99.99,0,0,0-.824-.382,1.307,1.307,0,0,0-1.3,1.37,1.307,1.307,0,0,0,1.3,1.37.99.99,0,0,0,.824-.382v.317h.567Zm-3.2,1.3v-1.637a.971.971,0,0,0-1.026-1.037,1.009,1.009,0,0,0-.917.464.959.959,0,0,0-.863-.464.863.863,0,0,0-.764.387v-.322H41.9v2.609h.573v-1.446a.61.61,0,0,1,.638-.693c.377,0,.568.246.568.688v1.452h.573v-1.446a.616.616,0,0,1,.638-.693c.388,0,.573.246.573.688v1.452Z"
                                      transform="translate(-36.695 219.86)" fill="#110f0d"></path>
                              </g>
                            </g>
                          </svg>
                        </Button>
                        {/*<Typography variant="body1" sx={{ margin: 0 , width: '0%'}}>*/}
                        {/*  Apare pe prima pagină a site-ului și este vizibil înainte ca utilizatorii să înceapă căutarea.*/}
                        {/*</Typography>*/}
                      </Box>
                      <Box sx={{mt: 1}}>

                        <Typography variant="body1" sx={{margin: 0, maxWidth: '20rem'}}>
                          Plată securizată prin platforma&nbsp;
                          <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">
                            <svg
                              style={{
                                zoom: '70%',
                                verticalAlign: 'middle', // Align SVG with the text
                              }}
                              viewBox="0 0 60 27"
                              xmlns="http://www.w3.org/2000/svg"
                              width="60" height="27" className="stripe-logo">
                              <title>Stripe logo</title>
                              <path fill={theme.palette.mode === 'dark' ? 'white' : 'black'}
                                    d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z"
                              ></path>
                            </svg>
                          </a>
                        </Typography>

                      </Box>

                    </CardContent>
                  </Card>

                </Grid>
              </Grid>

              <Typography color="text.secondary" variant="body2">
                Iată o previzualizare a anunțului tău
              </Typography>


              <ListingCard listingId={listing.id} isHovered={hovered}/>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between', // Ensures even spacing between the header and button
                  alignItems: 'center',           // Vertically aligns items on the same line
                  paddingTop: 1,                     // Adds some padding for layout
                }}
              >
                <Button
                  color="inherit"
                  variant="outlined"
                  component={RouterLink}
                  startIcon={
                    <SvgIcon>
                      <Edit02Icon />
                    </SvgIcon>
                  }
                  href={paths.dashboard.customers.edit}
                >
                  Modifică anunț
                </Button>

                <Button
                  color="error"
                  variant="outlined"
                >
                  Șterge anunț
                </Button>

              </Box>

            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default PreviewPage;
