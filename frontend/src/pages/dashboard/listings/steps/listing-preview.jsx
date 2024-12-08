import PropTypes from 'prop-types';
import CheckIcon from '@untitled-ui/icons-react/build/esm/Check';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { ListingCard } from './listing-card';

export const ListingPreview = ({ listingId }) => {

  return (
    <Stack spacing={2}>
        <Avatar
          sx={{
            backgroundColor: 'success.main',
            color: 'success.contrastText',
            height: 40,
            width: 40,
          }}
        >
          <SvgIcon>
            <CheckIcon />
          </SvgIcon>
        </Avatar>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Hooray! 🎉
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Here’s a preview of your newly created job
        </Typography>

      {/* Display the ListingCard */}
      <ListingCard listingId={listingId} />
    </Stack>
  );
};

ListingPreview.propTypes = {
  listingId: PropTypes.number.isRequired,
};
