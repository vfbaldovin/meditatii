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

export const ChoosePrice = ({ onBack, onNext, selectedSubject, price, setPrice, ...other }) => {
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
    if (selectedSubject?.id) {
      fetchRecommendedPrice(selectedSubject.id);
    } else {
      setRecommendedPrice(''); // Clear recommended price if no subject is selected
    }
  }, [selectedSubject]);

  const handleInputChange = (event) => {
    const value = event.target.value.replace(/[^0-9]/g, '').slice(0, 10); // Ensure only integers up to 10 digits
    setPrice(String(value)); // Update the price input state as a string
    if (value) setError(''); // Clear error if valid input
  };

  const handleChipClick = () => {
    if (recommendedPrice) {
      setPrice(String(recommendedPrice)); // Populate price input with the recommended price as a string
      setError(''); // Clear error on chip click
    }
  };

  const handleNext = () => {
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Te rugăm să introduci un preț pentru a finaliza.');
    } else {
      setError(''); // Clear error if validation passes
      onNext(); // Proceed to the next step
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
        error={!!error} // Show error styling if error exists
        helperText={error} // Display error message as helper text
        InputProps={{
          endAdornment: <InputAdornment position="end">lei / oră</InputAdornment>,
        }}
        inputProps={{
          min: 0,
          pattern: '[0-9]*',
          maxLength: 10,
        }}
      />

      <Stack alignItems="center" direction="row" spacing={2}>
        <Button color="inherit" onClick={onBack}>
          Înapoi
        </Button>
        <Button
          color="inherit"
          variant="outlined"
          endIcon={<SvgIcon><ArrowRightIcon /></SvgIcon>}
          onClick={handleNext} // Use the updated handleNext function
        >
          Finalizează
        </Button>
      </Stack>
    </Stack>
  );
};

ChoosePrice.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  selectedSubject: PropTypes.object,
  price: PropTypes.string.isRequired, // Ensure price is expected as a string
  setPrice: PropTypes.func.isRequired,
};
