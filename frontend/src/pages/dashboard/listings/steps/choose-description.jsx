import {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import IconButton from "@mui/material/IconButton";
import AnimatedAssistantIcon from "../animated-assistant-icon";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import Tooltip from "@mui/material/Tooltip";

export const ChooseDescription = (props) => {
  const { onBack, onNext, ...other } = props;
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [startDate, setStartDate] = useState(new Date('2022-09-22T11:41:50'));
  const [endDate, setEndDate] = useState(new Date('2023-01-11T12:41:50'));

  const handleStartDateChange = useCallback((date) => {
    setStartDate(date);
  }, []);

  const handleEndDateChange = useCallback((date) => {
    setEndDate(date);
  }, []);

  const handleTagAdd = useCallback((tag) => {
    setTags((prevState) => {
      return [...prevState, tag];
    });
  }, []);

  const handleTagDelete = useCallback((tag) => {
    setTags((prevState) => {
      return prevState.filter((t) => t !== tag);
    });
  }, []);

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
      {/*<div>*/}
      {/*  <Typography variant="h6">Alege o descriere</Typography>*/}
      {/*</div>*/}
      {/*<Button
        color="inherit"
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
          minWidth: 0,          // Override the default minWidth
          // padding: '7px 10px',   // Adjust padding to make the button more compact
          display: 'inline-flex', // Ensure the button stays inline and doesn't stretch
          justifyContent: 'center', // Center content
          alignItems: 'center',     // Center content vertically
        }}
      >
        Generează
      </Button>*/}

      <Stack spacing={3}>
        {/*<div*/}
        {/*  style={{*/}
        {/*    display: 'flex',       // Enables Flexbox to align items horizontally*/}
        {/*    alignItems: 'stretch', // Stretch items to be the same height*/}
        {/*    gap: '10px',           // Adds space between the TextField and Button*/}
        {/*  }}*/}
        {/*>*/}
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
            Generează
          </Button>
        </Tooltip>
          <TextField
            label="Descriere"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            inputProps={{
              maxLength: 5000, // Set maximum number of characters to 5000
            }}
            InputProps={{
              sx: {
                "& .MuiInputBase-input": {
                  fontSize: 'unset !important', // Override the font size
                },
                "& .MuiOutlinedInput-input": {
                  fontSize: 'unset !important', // Ensure font size is overridden
                },
              },
              // endAdornment: (
              //   <InputAdornment position="end">
              //     <svg width="0" height="0">
              //       <defs>
              //         <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              //           <stop offset="0%" stopColor="#1E56CC"/>
              //           <stop offset="25%" stopColor="#2970FF"/>
              //           <stop offset="50%" stopColor="#6366F1"/>
              //           <stop offset="75%" stopColor="#9E77ED"/>
              //           <stop offset="100%" stopColor="#B695F6"/>
              //         </linearGradient>
              //       </defs>
              //     </svg>
              //     <IconButton
              //       onClick={() => {}} // Define your click handler function
              //       aria-label="assistant-icon-button"
              //     >
              //       <AnimatedAssistantIcon fontSize="large" />
              //     </IconButton>
              //   </InputAdornment>
              // ),
            }}
            sx={{
              position: 'relative',
            }}
          />
{/*          <Button
            color="inherit"
            startIcon={
              <>
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E56CC"/>
                      <stop offset="25%" stopColor="#2970FF"/>
                      <stop offset="50%" stopColor="#6366F1"/>
                      <stop offset="75%" stopColor="#9E77ED"/>
                      <stop offset="100%" stopColor="#B695F6"/>
                    </linearGradient>
                  </defs>
                </svg>
                <AnimatedAssistantIcon fontSize="medium"/>
              </>
            }
            variant="outlined"
            sx={{
              alignSelf: 'stretch',  // This makes the button stretch to match TextField height
              minWidth: 0,           // Prevent default minimum width
              display: 'inline-flex', // Align the content inline
              justifyContent: 'center', // Center content horizontally
              alignItems: 'center',     // Center content vertically
              padding: '0 2rem',        // Ensure the button has padding for its content
            }}
          >
            Generează
          </Button>
        </div>*/}

      </Stack>


      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        {/*<Tooltip
          title="Nou"
          arrow
          open={open} // Controls tooltip visibility
          placement="bottom" // You can adjust this to the desired position
        >
          <Button
          color="inherit"
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
            minWidth: 0,          // Override the default minWidth
            // padding: '7px 10px',   // Adjust padding to make the button more compact
            display: 'inline-flex', // Ensure the button stays inline and doesn't stretch
            justifyContent: 'center', // Center content
            alignItems: 'center',     // Center content vertically
          }}
        >
          Generează
        </Button>
        </Tooltip>*/}
        <Button
          color="inherit"
          endIcon={
            <SvgIcon>
              <ArrowRightIcon/>
            </SvgIcon>
          }
          onClick={onNext}
          variant="outlined"
        >
          Înainte
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

ChooseDescription.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};
