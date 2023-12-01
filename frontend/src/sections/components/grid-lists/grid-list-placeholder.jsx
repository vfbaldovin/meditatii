import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

export const GridListPlaceholder = ({listLength}) => {
  return (
    <Box
      sx={{
        // backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50'),
        p: 3,
      }}
    >
    <Grid container spacing={3}>
      {Array.from(new Array(listLength)).map((_, index) => (
        <Grid item key={index} xs={12} md={12}>
          <Card>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton width="50%" />
                  <Skeleton width="30%" />
                </Box>
              </Stack>
              <Skeleton width="100%" />
              <Skeleton width="100%" />
              <Skeleton width="100%" />
            </Box>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Skeleton width="20%" />
                <Skeleton width="20%" />
                <Skeleton width="20%" />

              </Stack>
            </Box>

          </Card>
        </Grid>
      ))}
    </Grid>
    </Box>
  );
};
