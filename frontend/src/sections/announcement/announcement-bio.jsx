import React from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, SvgIcon, Typography, Link } from '@mui/material';
import Briefcase01Icon from "@untitled-ui/icons-react/build/esm/Briefcase01";
import BookOpen01Icon from "@untitled-ui/icons-react/build/esm/BookOpen01";
import Home02Icon from "@untitled-ui/icons-react/build/esm/Home02";
import Mail01Icon from "@untitled-ui/icons-react/build/esm/Mail01";
import {PhoneCall01} from "@untitled-ui/icons-react";
import Box from "@mui/material/Box";

export const AnnouncementBio = ({ announcement }) => {
  return (
    <Box
      sx={{
      '@media (max-width: 1199px)': {
        '.MuiList-root': {
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'left',
          gap: 2 // adjust as needed for spacing between items
        },
        '.MuiListItem-root': {
          width: 'auto' // or specific width if you want to control the width of each item
        }
      }
    }}>
    <List>
      {announcement.occupation && (
        <ListItem disableGutters divider>
          <ListItemAvatar style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SvgIcon color="action">
              <Briefcase01Icon />
            </SvgIcon>
          </ListItemAvatar>
          <ListItemText
            disableTypography
            primary={
              <Typography color="text.primary" href="#" variant="body1">
                {announcement.occupation}
              </Typography>
            }
          />
        </ListItem>
      )}

      {announcement.county && (
        <ListItem disableGutters divider>
          <ListItemAvatar style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SvgIcon color="action">
              <Home02Icon />
            </SvgIcon>
          </ListItemAvatar>
          <ListItemText
            disableTypography
            primary={
              <Typography color="text.primary" href="#" variant="body1">
                {announcement.county}
              </Typography>
            }
          />
        </ListItem>
      )}

      {announcement.education && (
        <ListItem disableGutters divider>
          <ListItemAvatar style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SvgIcon color="action">
              <BookOpen01Icon />
            </SvgIcon>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography color="text.primary" href="#" variant="body1">
                {announcement.education}
              </Typography>
            }
          />
        </ListItem>
      )}

      {announcement.phone && (
        <ListItem
          disableGutters
          divider
          onClick={() => {
            window.location.href = `tel:${announcement.phone}`;
          }}
        >
          <ListItemAvatar style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SvgIcon color="action">
              <PhoneCall01 />
            </SvgIcon>
          </ListItemAvatar>
          <ListItemText
            disableTypography
            primary={
              <Link color="text.primary" href="#" variant="body1">
                {announcement.phone}
              </Link>
            }
          />
        </ListItem>
      )}

      {announcement.email && (
        <ListItem
          disableGutters
          onClick={() => {
            window.location.href = `mailto:${announcement.email}`;
          }}
        >
          <ListItemAvatar style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SvgIcon color="action">
              <Mail01Icon />
            </SvgIcon>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Link color="text.primary" href="#" variant="body1">
                {announcement.email}
              </Link>
            }
          />
        </ListItem>
      )}

    </List>
    </Box>
  );
};
