import {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {PriceRecommendation} from "./price-recommendation";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import AnimatedAssistantIcon from "../animated-assistant-icon";
import Tooltip from "@mui/material/Tooltip";

export const PriceStep = (props) => {
  const { onBack, onNext, ...other } = props;
  const [content, setContent] = useState('');

  const handleContentChange = useCallback((value) => {
    setContent(value);
  }, []);

  const handleInputChange = (event) => {
    let value = event.target.value;

    // Replace non-integer characters and ensure positive values only
    let positiveIntegerValue = value.replace(/[^0-9]/g, '');

    // Limit to a maximum of 10 digits
    if (positiveIntegerValue.length > 10) {
      positiveIntegerValue = positiveIntegerValue.slice(0, 10);
    }

    event.target.value = positiveIntegerValue; // Set the field to only allow positive integers up to 10 digits
  };
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Open the tooltip after a delay when the component loads
    const timer = setTimeout(() => {
      setOpen(true);
    }, 500); // Delay the tooltip by 500ms (optional)

    // Close the tooltip automatically after 3 seconds
    const closeTimer = setTimeout(() => {
      setOpen(false);
    }, 3500); // Keeps the tooltip visible for 3 seconds

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer); // Clear timers on unmount
    };
  }, []);

  return (
    <Stack
      spacing={3}
      {...other}
    >
     {/* <div>
        <Typography variant="h6">Alege un preț pe oră</Typography>
      </div>*/}

      <Tooltip
        title="Nou"
        arrow
        open={open} // Controls tooltip visibility
        placement="right" // You can adjust this to the desired position
      >
        <Button
          color="inherit"
          /*
                    endIcon={
                      <Chip
                        color="primary"
                        label="nou"
                        size="small"
                        sx={{
                          fontSize: '70%',      // Reduce font size for the label
                          height: '16px',         // Small height for the Chip
                          padding: '0 2px',       // Small padding to reduce width
                          borderRadius: '8px',    // Smaller border radius to match size
                          '& .MuiChip-label': {   // Target the Chip label specifically
                            fontSize: '70%',      // Reduce font size for the label
                            paddingLeft: '2px',   // Smaller padding around the label
                            paddingRight: '2px',
                          },
                        }}
                      />}
          */
          startIcon={
            <>
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E56CC" />
                    <stop offset="25%" stopColor="#2970FF" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="75%" stopColor="#9E77ED" />
                    <stop offset="100%" stopColor="#B695F6" />
                  </linearGradient>
                </defs>
              </svg>
              <AnimatedAssistantIcon fontSize="medium" />
            </>
          }
          variant="outlined"
          sx={{
            width: 'fit-content', // Ensure the button width fits the content
            // minWidth: '100%',          // Override the default minWidth
            // padding: '7px 10px',   // Adjust padding to make the button more compact
            display: 'inline-flex', // Ensure the button stays inline and doesn't stretch
            justifyContent: 'center', // Center content
            alignItems: 'center',     // Center content vertically
          }}
        >
          Recomandă
        </Button>
      </Tooltip>


      <TextField
        fullWidth
        label="Preț"
        name="price"
        variant="outlined"
        InputProps={{
          endAdornment: <InputAdornment position="end">lei / oră</InputAdornment>,
        }}
        onInput={handleInputChange} // Ensure positive integers up to 10 digits
        inputProps={{
          min: 0, // Prevent negative input
          pattern: "[0-9]*", // Restrict input to digits only
          maxLength: 10, // Restrict maximum length to 10 digits
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
};
