import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { paths } from 'src/paths';
import SvgIcon from "@mui/material/SvgIcon";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import {ListingCreateFormOld} from "./listing-create-form-old";
import React from "react";

const Page = () => {
  usePageView();

  return (
    <>
      <Seo title="Anunț nou" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4">Anunț nou</Typography>
                </Stack>
                <Stack alignItems="center" direction="row" spacing={2}>
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

                </Stack>
              </Stack>
            </Stack>
            <ListingCreateFormOld/>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
