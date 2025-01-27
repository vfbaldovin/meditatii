import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Link from '@mui/material/Link';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import Skeleton from '@mui/material/Skeleton';
import { useAuth } from '../../../../hooks/use-auth';
import CheckVerified01 from "@untitled-ui/icons-react/build/esm/CheckVerified01";
import Tooltip from "@mui/material/Tooltip";

export const ListingCard = ({ listingId, isHovered, isHoverable = true  }) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const { fetchWithAuth } = useAuth();
  const [listing, setListing] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        // Fetch listing details
        const response = await fetchWithAuth(`/api/dashboard/listings/${listingId}`);
        if (response.ok) {
          const data = await response.json();
          setListing(data);

          // Construct the avatar URL using tutorId
          if (data.tutorId) {
            const tutorAvatarUrl = `${apiBaseUrl}/api/user/${data.tutorId}/profile-image?t=${new Date().getTime()}`;
            setAvatarUrl(tutorAvatarUrl);
          }
        } else {
          console.error('Failed to fetch listing details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setLoading(false); // Set loading to false when data is fetched
      }
    };

    fetchListing();
  }, [fetchWithAuth, listingId, apiBaseUrl]);

  if (loading) {
    // Render skeleton while loading
    return (
      <Card
        sx={{
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '0.5rem',
          p: 2,
          cursor: 'pointer',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={15} sx={{ mt: 1 }} />
            </Box>
          </Stack>
          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1, mb: 2 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton variant="text" width="30%" height={20} />
          </Stack>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      id={listing.id}
      sx={{
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '0.5rem',
        cursor: isHoverable ? 'pointer' : 'default',
        position: 'relative',
        border: (theme) => (theme.palette.mode === 'light' ? '1px solid whitesmoke' : '1px solid rgb(47, 79, 79)'),
        '&:hover': isHoverable
          ? {
            border: (theme) => (theme.palette.mode === 'light' ? '1px solid #6C737F' : '1px solid whitesmoke'),
            borderRadius: '0.5rem',
          }
          : {},
      }}
    >
      {isHovered && (
        <Tooltip title="Insignă anunț promovat" arrow open={isHovered} placement="bottom-end"
                 PopperProps={{
                   modifiers: [
                     {
                       name: 'zIndex',
                       enabled: true,
                       phase: 'afterWrite',
                       fn: ({ state }) => {
                         state.styles.popper.zIndex = 1098; // Adjust as needed to be below your header
                       },
                     },
                   ],
                 }}
        >
        <WorkspacePremiumIcon
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            color: '#FFC107',
            fontWeight: 'bold',
            backgroundSize: '200% 200%',
            backgroundPosition: '50% 50%',
            borderRadius: '50%',
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.9,
            transition: 'background-position 1s ease',
            '&:hover': {
              backgroundPosition: '100% 0',
            },
          }}
        />
        </Tooltip>
      )}
      <Box sx={{ p: 2, boxShadow: 'unset', padding: '8px 16px 16px' }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            mt: 2,
          }}
        >
          <Avatar src={avatarUrl} />
          <Box
            sx={{
              ml: 2,
              boxShadow: 'unset',
              paddingRight: listing.promoted ? '2.5rem' : '0.5rem',
              maxHeight: '4rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Link
              color="text.primary"
              variant="h6"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {listing.subject}
            </Link>
            <Box display="flex" alignItems="center">
              <Typography color="text.secondary" variant="body2">
                de{' '}
                <Typography component="span" color="text.primary" variant="subtitle2">
                  {listing.tutorName}
                </Typography>
              </Typography>
              <Box display="flex" alignItems="center" ml={1}>

                <Tooltip title="Insignă meditator verificat diponibilă permanent" arrow open={isHovered}
                         placement="right-start"
                         PopperProps={{
                           modifiers: [
                             {
                               name: 'zIndex',
                               enabled: true,
                               phase: 'afterWrite',
                               fn: ({ state }) => {
                                 state.styles.popper.zIndex = 1098; // Adjust as needed to be below your header
                               },
                             },
                           ],
                         }}
                >
                  <SvgIcon
                    sx={{
                      color: 'white',
                      '& path': {
                        fill: 'none', // Remove inner color
                        stroke: (theme) => theme.palette.primary.main, // Set the outline color
                        strokeWidth: 2, // Adjust the thickness of the outline
                      },
                    }}
                  >
                    {isHovered && <CheckVerified01 />}
                  </SvgIcon>
                </Tooltip>


              </Box>
            </Box>
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
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {listing.description}
        </Typography>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={3}>
          <div>
            <Typography color="primary.main" variant="subtitle2">
              {listing.price} lei / oră
            </Typography>
          </div>
          <div>
            <Typography color="primary.main" variant="subtitle2">
              {listing.city}
            </Typography>
          </div>
        </Stack>
      </Box>
    </Card>
  );
};

ListingCard.propTypes = {
  listingId: PropTypes.number.isRequired,
};
