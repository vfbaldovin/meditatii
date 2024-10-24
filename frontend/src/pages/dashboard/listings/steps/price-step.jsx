import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Chip from '@mui/material/Chip';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {InfoCircle} from "@untitled-ui/icons-react";

export const PriceStep = (props) => {
  const { onBack, onNext, selectedSubject, ...other } = props;
  const [price, setPrice] = useState(''); // State to hold the price input
  const [recommendedPrice, setRecommendedPrice] = useState(null); // State to store the recommended price

  // Function to fetch the recommended price for the selected subject
  const fetchRecommendedPrice = async (subjectId) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await fetch(`${apiBaseUrl}/api/dashboard/subjects/${subjectId}/price`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.id) {
          setRecommendedPrice(data.id); // Set the recommended price if available
        } else {
          setRecommendedPrice(null); // No price returned, clear recommended price
        }
      }
    } catch (error) {
      console.error('Error fetching recommended price:', error);
      setRecommendedPrice(null); // Handle errors gracefully by clearing the recommended price
    }
  };

  // Fetch the recommended price whenever the selectedSubject changes
  useEffect(() => {
    if (selectedSubject && selectedSubject.id) {
      fetchRecommendedPrice(selectedSubject.id);
    } else {
      setRecommendedPrice(null); // Clear recommended price if no subject is selected
    }
  }, [selectedSubject]);

  const handleInputChange = (event) => {
    let value = event.target.value;

    // Replace non-integer characters and ensure positive values only
    let positiveIntegerValue = value.replace(/[^0-9]/g, '');

    // Limit to a maximum of 10 digits
    if (positiveIntegerValue.length > 10) {
      positiveIntegerValue = positiveIntegerValue.slice(0, 10);
    }

    setPrice(positiveIntegerValue); // Update the price input state
  };

  const handleChipClick = () => {
    if (recommendedPrice) {
      setPrice(recommendedPrice); // Populate the price input with the recommended price when Chip is clicked
    }
  };

  return (
    <Stack
      spacing={3}
      {...other}
    >

      {recommendedPrice && (
        <Stack spacing={1}>
          {/* First row with the label and the info icon */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              color="text.secondary"
              variant="h6"
            >
              Recomandarea noastră
            </Typography>
            <Tooltip
              title={
                <Typography sx={{ fontSize: '0.95rem' }}>
                  Prețul recomandat este calculat în funcție de media aritmetică a celorlalte anunțuri.
                </Typography>
              }
              placement="top"
            >
              <IconButton size="small">
                <InfoCircle fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Second row with the Chip */}
          <Stack direction="row">
            <Chip
              label={`${recommendedPrice} lei / oră`}
              clickable
              onClick={handleChipClick}
              sx={{
                fontSize: '0.9rem',
                height: 24,
                padding: '0 8px',
                color: 'primary.main',
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
        label={`Preț pe oră`} // Label remains independent of recommended price
        name="price"
        variant="outlined"
        value={price} // Bind the price state to the input field
        onInput={handleInputChange} // Ensure positive integers up to 10 digits
        InputProps={{
          endAdornment: <InputAdornment position="end">lei / oră</InputAdornment>,
        }}
        inputProps={{
          min: 0, // Prevent negative input
          pattern: "[0-9]*", // Restrict input to digits only
          maxLength: 3, // Restrict maximum length to 10 digits
        }}

      />

      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <Button
          color="inherit"
          variant="outlined"
          endIcon={
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          }
          onClick={onNext}
        >
          Finalizează
        </Button>
        <Button
          color="inherit"
          onClick={onBack}
        >
          Înapoi
        </Button>
      </Stack>
    </Stack>
  );
};

PriceStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  selectedSubject: PropTypes.object, // Add selectedSubject to prop types
};
