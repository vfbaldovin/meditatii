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
import CardContent from "@mui/material/CardContent";
import SvgIcon from "@mui/material/SvgIcon";

const PreviewPage = () => {
  const {id} = useParams();
  const {search} = useLocation();
  const {fetchWithAuth} = useAuth();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(false);

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
      <Seo title={`Anunț - ${listing?.subject?.name}`}/>

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

            <Stack maxWidth="sm" spacing={2}>

              <Typography variant="h4">
                {listing.subject}
              </Typography>
              {isNew && (

              <Typography variant="h6" sx={{mt: 2}}>
                Felicitări, anunțul tău a fost creat cu succes!{' '}
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
              <Grid container spacing={2}>
                {/* First Card */}
                <Grid item xs={6}>
                  <Card
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    sx={{
                      width: { xs: "100%", sm: 250 }, // Full width on small screens, fixed width otherwise
                      height: { xs: "100%", sm: 250 }, // Smaller height on small screens
                      position: "relative",
                      // Background image settings
                      backgroundImage: "url(/assets/abstract_wallpaper_9.webp)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      color: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between", // Space out header, middle text, and footer
                      borderRadius: 2, // Smooth border radius
                      overflow: "hidden", // Clip content if it overflows
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      border: (theme) => (theme.palette.mode === 'light' ? '1px solid whitesmoke' : '2px solid rgb(47, 79, 79)'),
                      '&:hover': {
                        border: (theme) => (theme.palette.mode === 'light' ? '1px solid #6C737F' : '2px solid whitesmoke'),
                        // borderRadius: '20px',
                      },
                    }}
                  >
                    {/* Header (top) */}
                    <CardHeader
                      title="STANDARD"
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.25)",
                        py: 1,
                        "& .MuiCardHeader-title": {
                          fontSize: "1rem",
                        },
                      }}
                    />

                    {/* Middle Content */}
                    <Box
                      sx={{
                        textAlign: "center", // Center text horizontally
                        margin: "auto", // Center text vertically

                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: "bold",
                          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                      }}
                      >
                        10 lei / lună
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.25)", // Fundal semitransparent
                        py: 1, // Padding vertical
                        textAlign: "center", // Text centrat
                        fontSize: { xs: "0.8rem", sm: "1rem" }, // Dimensiuni responsive
                      }}
                    >
                      <Typography sx={{color: "#FFFFFF"}} variant="body2">poziție prioritară, refresh automat, statistici, insignă meditator verificat</Typography>
                    </Box>
                  </Card>

                </Grid>

                <Grid item xs={6}>
                  <Card
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    sx={{
                      width: { xs: "100%", sm: 250 }, // Full width on small screens, fixed width otherwise
                      height: { xs: 300, sm: 250 }, // Smaller height on small screens
                      position: "relative",
                      // Background image settings
                      backgroundImage: "url(/assets/promote_5.webp)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      color: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between", // Space out header, middle text, and footer
                      borderRadius: 2, // Smooth border radius
                      // boxShadow: 3, // Slight shadow for a modern look
                      overflow: "hidden", // Clip content if it overflows
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      border: (theme) => (theme.palette.mode === 'light' ? '1px solid whitesmoke' : '2px solid rgb(47, 79, 79)'),
                      '&:hover': {
                        border: (theme) => (theme.palette.mode === 'light' ? '1px solid #6C737F' : '2px solid whitesmoke'),
                        // borderRadius: '20px',
                      },
                    }}
                  >
                    {/* Header (top) */}
                    <CardHeader
                      title="PREMIUM"
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.25)",
                        py: 1,
                        "& .MuiCardHeader-title": {
                          fontSize: "1rem",
                        },
                      }}
                    />

                    {/* Middle Content */}
                    <Box
                      sx={{
                        textAlign: "center", // Center text horizontally
                        margin: "auto", // Center text vertically
                      }}
                    >
                      <Typography variant="h3"
                                  sx={{
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                                  }}>
                        30 lei / lună
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.25)", // Fundal semitransparent
                        py: 1, // Padding vertical
                        textAlign: "center", // Text centrat
                        fontSize: { xs: "0.8rem", sm: "1rem" }, // Dimensiuni responsive
                      }}
                    >
                      <Typography  sx={{color: "#FFFFFF"}} variant="body2">STANDARD + recomandare automată prin email către elevii nou înregistrați</Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>

                <Typography color="text.secondary" variant="body2">
                  Iată o previzualizare a anunțului tău
                </Typography>


              <ListingCard listingId={listing.id} isHovered={hovered}/>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default PreviewPage;
