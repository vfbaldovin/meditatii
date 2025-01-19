import React, {useState} from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, SvgIcon, Typography, Link } from '@mui/material';
import Briefcase01Icon from "@untitled-ui/icons-react/build/esm/Briefcase01";
import BookOpen01Icon from "@untitled-ui/icons-react/build/esm/BookOpen01";
import Home02Icon from "@untitled-ui/icons-react/build/esm/Home02";
import Mail01Icon from "@untitled-ui/icons-react/build/esm/Mail01";
import {PhoneCall01} from "@untitled-ui/icons-react";
import Box from "@mui/material/Box";

export const ListingBio = ({ listing: listing }) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [isBlurred, setIsBlurred] = useState(true);

  // Function to permanently remove blur
  const revealNumber = () => {
    setIsBlurred(false);
  };

  // Split the phone number into visible and blurred parts
  const visiblePart = listing.phone?.slice(0, 2);
  const blurredPart = listing.phone?.slice(2);
  return (
    <Box
      sx={{
      '@media (max-width: 1199px)': {
        '.MuiList-root': {
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'left',
          gap: 2
        },
        '.MuiListItem-root': {
          width: 'auto'
        }
      }
    }}>
    <List>
      {listing.occupation && (
        <ListItem disableGutters divider>
          <ListItemAvatar style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SvgIcon color="action">
              <Briefcase01Icon />
            </SvgIcon>
          </ListItemAvatar>
          <ListItemText
            disableTypography
            primary={
              <Typography color="text.primary" href="#" variant="body1"
                          sx={{
                            display: 'block', // Ensures the text spans multiple lines
                            wordBreak: 'break-word', // Breaks long words if necessary
                            overflow: 'visible', // Allow content to extend beyond if needed
                            whiteSpace: 'normal', // Allow text to wrap to the next line
                          }}>
                {listing.occupation}
              </Typography>
            }
          />
        </ListItem>
      )}

      {listing.county && (
        <ListItem disableGutters divider>
          <ListItemAvatar style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SvgIcon color="action">
              <Home02Icon />
            </SvgIcon>
          </ListItemAvatar>
          <ListItemText
            disableTypography
            primary={
              <Typography color="text.primary" href="#" variant="body1"
                          sx={{
                            display: 'block', // Ensures the text spans multiple lines
                            wordBreak: 'break-word', // Breaks long words if necessary
                            overflow: 'visible', // Allow content to extend beyond if needed
                            whiteSpace: 'normal', // Allow text to wrap to the next line
                          }}>
                {listing.county}
              </Typography>
            }
          />
        </ListItem>
      )}

      {listing.education && (
        <ListItem disableGutters divider>
          <ListItemAvatar style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SvgIcon color="action">
              <BookOpen01Icon />
            </SvgIcon>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography color="text.primary" href="#" variant="body1"
                          sx={{
                            display: 'block', // Ensures the text spans multiple lines
                            wordBreak: 'break-word', // Breaks long words if necessary
                            overflow: 'visible', // Allow content to extend beyond if needed
                            whiteSpace: 'normal', // Allow text to wrap to the next line
                          }}>
                {listing.education}
              </Typography>
            }
          />
        </ListItem>
      )}

      {listing.phone && (
        <ListItem disableGutters divider onClick={isBlurred ? revealNumber : () => window.location.href = `tel:${listing.phone}`}>
          <ListItemAvatar style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SvgIcon color="action">
              <PhoneCall01 />
            </SvgIcon>
          </ListItemAvatar>
          <ListItemText
            disableTypography
            primary={
              <Typography
                color="text.primary"
                variant="body1"
                sx={{
                  display: 'block', // Ensures the text spans multiple lines
                  wordBreak: 'break-word', // Breaks long words if necessary
                  overflow: 'visible', // Allow content to extend beyond if needed
                  whiteSpace: 'normal', // Allow text to wrap to the next line
                  cursor: 'pointer',
                  userSelect: 'none',
                  // display: 'inline-flex', // Ensures the text aligns correctly
                }}
              >
                {visiblePart}
                <span
                  style={{
                    filter: isBlurred ? 'blur(5px)' : 'none',
                    transition: 'filter 0.3s',
                  }}
                >
                    {blurredPart}
                  </span>
              </Typography>
            }
          />
        </ListItem>
      )}
      {listing.email && (
        <ListItem
          disableGutters
          onClick={() => {
            window.location.href = `mailto:${listing.email}`;
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
                {listing.email}
              </Link>
            }
          />
        </ListItem>
      )}

    </List>
    </Box>
  );
};
