import React, { useState } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { ListingCreateForm } from "./listing-create-form";

const Page = () => {
  usePageView();

  // Array of wallpaper URLs
  const wallpapers = [
    'url(/assets/abstract_wallpaper_1.webp)',
    'url(/assets/abstract_wallpaper.png)',
    'url(/assets/abstract_wallpaper_3.webp)',
    'url(/assets/abstract_wallpaper_9.webp)',
    'url(/assets/abstract_wallpaper_10.webp)'
  ];

  // State to track the current wallpaper index
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);

  // Function to cycle through wallpapers
  const handleBackgroundChange = () => {
    setCurrentWallpaperIndex((prevIndex) =>
      (prevIndex + 1) % wallpapers.length  // Increment and reset index when reaching the end of the array
    );
  };

  return (
    <>
      <Seo title="Anunț nou" />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexGrow: 1,
        }}
      >
        <Grid
          container
          sx={{ flexGrow: 1 }}
        >
          <Grid
            xs={12}
            sm={4}
            onClick={handleBackgroundChange}
            sx={{
              backgroundImage: wallpapers[currentWallpaperIndex],  // Use the current wallpaper based on the state index
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              display: {
                xs: 'none',
                md: 'block',
              },
              cursor: 'pointer', // Add a pointer cursor to indicate clickability
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
            <Stack
              maxWidth="sm"
              spacing={3}
            >
              <Typography variant="h4">Creează anunț</Typography>
              <ListingCreateForm />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Page;
