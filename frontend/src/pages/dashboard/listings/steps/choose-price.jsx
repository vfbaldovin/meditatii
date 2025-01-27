import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { InfoCircle } from '@untitled-ui/icons-react';
import { useAuth } from '../../../../hooks/use-auth';

export const ChoosePrice = (props) => {
  const { onBack, onNext, selectedSubject, price, setPrice, showNavigationButtons = true,
    ...other } = props;
  const [recommendedPrice, setRecommendedPrice] = useState(null); // State to store the recommended price
  const [error, setError] = useState(''); // State to store validation error message
  const { fetchWithAuth } = useAuth(); // Destructure fetchWithAuth from useAuth

  // Function to fetch the recommended price for the selected subject
  const fetchRecommendedPrice = async (subjectId) => {
    try {
      const response = await fetchWithAuth(`/api/dashboard/subjects/${subjectId}/price`);
      if (response.ok) {
        const data = await response.json();
        setRecommendedPrice(String(data.id || '')); // Ensure recommended price is a string
      }
    } catch (error) {
      console.error('Error fetching recommended price:', error);
      setRecommendedPrice(''); // Ensure it's an empty string if error occurs
    }
  };

  // Fetch the recommended price whenever the selectedSubject changes
  useEffect(() => {
    // Fetch the recommended price only if subjectId is valid and there's no existing fetch
    if (selectedSubject?.id) {
      fetchRecommendedPrice(selectedSubject.id);
    } else {
      setRecommendedPrice(''); // Clear recommended price if no subject is selected
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject?.id]); // Trigger only when the ID changes


  const handleInputChange = (event) => {
    // Remove non-digits and limit to 3 digits
    let value = event.target.value
      .replace(/[^0-9]/g, '')  // Keep only digits
      .slice(0, 3);            // Limit to 3 digits

    // If value is empty or zero, don't update the input
    if (!value || value === '0') {
      value = '';
    }

    setPrice(value);
    if (value) setError('');
  };

  const handleNext = () => {
    const numericPrice = Number(price);
    if (!price || numericPrice <= 0 || numericPrice > 999) {
      setError('Te rugăm să introduci un preț între 1 și 999 lei.');
    } else {
      setError('');
      onNext();
    }
  };

  const handleChipClick = () => {
    if (recommendedPrice) {
      setPrice(String(recommendedPrice)); // Populate price input with the recommended price as a string
      setError(''); // Clear error on chip click
    }
  };


  return (
    <Stack spacing={3} {...other}>
      {recommendedPrice && (
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">Recomandarea noastră</Typography>
            <Tooltip
              title={
                <Typography sx={{ fontSize: '0.95rem' }}>
                  Prețul recomandat este calculat în funcție de media aritmetică a celorlalte anunțuri de la aceeași materie.
                </Typography>
              }
              placement="top"
            >
              <IconButton size="small">
                <InfoCircle fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack direction="row">
            <Chip
              label={`${recommendedPrice} lei / oră`}
              clickable
              onClick={handleChipClick}
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            />
          </Stack>
        </Stack>
      )}

      <TextField
        fullWidth
        label="Preț pe oră"
        variant="outlined"
        value={price}
        onChange={handleInputChange}
        error={!!error}
        helperText={error}
        InputProps={{
          endAdornment: <InputAdornment position="end">lei / oră</InputAdornment>,
        }}
        inputProps={{
          min: 1,
          max: 999,
          pattern: '[1-9][0-9]{0,2}',
          maxLength: 3,
          inputMode: 'numeric',
        }}
      />
      {showNavigationButtons && (

      <Stack alignItems="center" direction="row" spacing={2}>
        <Button color="inherit" onClick={onBack}>
          Înapoi
        </Button>
        <Button
          // color="inherit"
          variant="contained"
          endIcon={<SvgIcon><ArrowRightIcon /></SvgIcon>}
          onClick={handleNext} // Use the updated handleNext function
        >
          Finalizează
        </Button>
      </Stack>
      )}

    </Stack>
  );
};

ChoosePrice.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  selectedSubject: PropTypes.object,
  price: PropTypes.string.isRequired, // Ensure price is expected as a string
  setPrice: PropTypes.func.isRequired,
  showNavigationButtons: PropTypes.bool, // Prop to control visibility of navigation buttons

};
