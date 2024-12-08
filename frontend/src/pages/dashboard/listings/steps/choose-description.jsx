import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AnimatedAssistantIcon from "../animated-assistant-icon";
import {useAuth} from "../../../../hooks/use-auth";
import StopCircle from "@untitled-ui/icons-react/build/esm/StopCircle";

export const ChooseDescription = (props) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const { onBack, onNext, selectedSubject, description, setDescription, ...other } = props;

  const { fetchWithAuth } = useAuth(); // Destructure fetchWithAuth from useAuth

  const [loading, setLoading] = useState(false); // Local loading state
  const [errorMessage, setErrorMessage] = useState(''); // State for validation message
  const controllerRef = useRef(null); // Ref to store the AbortController

  // Create a ref to access the TextField DOM element
  const textFieldRef = useRef(null);

  // Maximum number of characters allowed
  const MAX_CHARACTERS = 5000;

  // Function to generate description as a stream
  const generateDescription = async () => {
    if (!selectedSubject || !selectedSubject.id) {
      return; // Do nothing if no subject is selected
    }

    // Clear the previous description before generating a new one
    setDescription('');  // Reset the description
    setErrorMessage(''); // Clear any error message

    setLoading(true); // Set loading state

    // Create an AbortController to cancel the request if necessary
    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;

    try {
      const response = await fetchWithAuth(
        `/api/dashboard/subjects/${selectedSubject.id}/description`,
        {
          method: 'GET',
          signal, // Attach the signal to the request for cancellation
        }
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');  // Specify 'utf-8' explicitly

      let done = false;
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          // Decode the UTF-8 response and append it to the description
          const chunk = decoder.decode(value, { stream: true });
          setDescription(prevDescription => prevDescription + chunk);
          setErrorMessage(''); // Clear error if any text is generated

          // Scroll the textarea to the bottom after updating the description
          if (textFieldRef.current) {
            const textAreaElement = textFieldRef.current.querySelector('textarea');
            if (textAreaElement) {
              textAreaElement.scrollTop = textAreaElement.scrollHeight;
            }
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted'); // Catch if the fetch was aborted
      } else {
        console.error('Error generating description:', err);
        setErrorMessage('Error generating description');
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleNext = () => {
    // Abort the API call when "Înainte" is pressed
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Validate the description length
    if (description.length < 100) {
      setErrorMessage('Descrierea trebuie să conțină cel puțin 100 de caractere.');
      return; // Prevent the user from going forward
    }

    setErrorMessage(''); // Clear error message if validation passes
    onNext(); // Continue with the next step
  };

  const handleBack = () => {
    // Abort the API call when "Înapoi" is pressed
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    onBack(); // Continue with the previous step
  };

  // Clear error message when the description changes
  useEffect(() => {
    if (errorMessage && description.length > 0) {
      setErrorMessage(''); // Clear error message when the user types
    }
  }, [description]); // Listen for changes to `description`

  return (
    <Stack
      spacing={3}
      {...other}
    >
      <Stack spacing={3}>
        <Stack
          spacing={3}
          direction="row"
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Generate Button */}
          <Button
            color="inherit"
            onClick={generateDescription}
            startIcon={
              <>
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%">
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
            disabled={loading} // Disable when loading
            sx={{
              width: 'fit-content',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {loading ? 'Generare...' : 'Generează'}
          </Button>

          {/* Stop Button */}
          {loading && (
            <Button
              color="inherit"
              onClick={() => controllerRef.current?.abort()}
              startIcon={
                <StopCircle style={{ color: '#d32f2f' }} /> // Use a red hex color
              }
              variant="outlined"
              sx={{
                width: 'fit-content',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              Oprește
            </Button>


          )}
        </Stack>


        {/* TextField with error message in helperText */}
        <TextField
          label="Descriere"
          multiline
          rows={6}
          fullWidth
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          helperText={
            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      {/* Left-aligned error message */}
              <span style={{ color: errorMessage ? 'red' : 'inherit' }}>
        {errorMessage || ''}
      </span>

              {/* Right-aligned character count */}
              <span>
        {`${description.length}/${MAX_CHARACTERS}`}
      </span>
    </span>
          }
          inputProps={{
            maxLength: MAX_CHARACTERS,
          }}
          InputProps={{
            sx: {
              "& .MuiInputBase-input": {
                fontSize: 'unset !important',
              },
              "& .MuiOutlinedInput-input": {
                fontSize: 'unset !important',
              },
            },
          }}
          ref={textFieldRef}
          sx={{
            position: 'relative',
          }}
          error={!!errorMessage}
        />

      </Stack>

      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <Button
          color="inherit"
          endIcon={
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          }
          onClick={handleNext} // Use handleNext to abort and proceed
          variant="outlined"
        >
          Înainte
        </Button>
        <Button
          color="inherit"
          onClick={handleBack} // Use handleBack to abort and go back
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
  selectedSubject: PropTypes.object,
  description: PropTypes.string.isRequired, // Add prop type for description
  setDescription: PropTypes.func.isRequired, // Add prop type for setDescription
};
