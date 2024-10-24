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

  const wallpapers = [
    'url(/assets/writing.webp)',
    'url(/assets/abstract_wallpaper_1.webp)',
    'url(/assets/abstract_wallpaper.png)',
    'url(/assets/abstract_wallpaper_3.webp)',
    'url(/assets/abstract_wallpaper_9.webp)',
    'url(/assets/abstract_wallpaper_10.webp)'
  ];

  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState({ name: '', id: '' }); // State for both name and id

  const handleBackgroundChange = () => {
    setCurrentWallpaperIndex((prevIndex) =>
      (prevIndex + 1) % wallpapers.length
    );
  };

  const handleSubjectSelect = (subject) => {
    if (subject && subject.name && subject.id) {
      // Update both subject name and id
      setSelectedSubject({
        name: subject.name,
        id: subject.id
      });
    } else {
      // Reset if no subject is selected
      setSelectedSubject({ name: '', id: '' });
    }
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
              backgroundImage: wallpapers[currentWallpaperIndex],
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              display: {
                xs: 'none',
                md: 'block',
              },
              cursor: 'pointer',
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
              <Typography variant="h4">
                Creează anunț {selectedSubject.name && `• ${selectedSubject.name}`}
              </Typography>
              <ListingCreateForm onSubjectSelect={handleSubjectSelect} />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Page;
