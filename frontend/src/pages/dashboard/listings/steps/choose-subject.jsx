import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import AnimatedAssistantIcon from "../animated-assistant-icon";
import axios from "axios";

export const ChooseSubject = (props) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const { onBack, onNext, ...other } = props;
  const [subjects, setSubjects] = useState([]);  // State to store subjects
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  const token = sessionStorage.getItem('accessToken');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/dashboard/subjects/available`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubjects(response.data); // Set subjects
      } catch (err) {
        console.error('Error fetching subjects:', err);
      } finally {
        setIsLoadingSubjects(false); // Stop loading
      }
    };

    fetchSubjects();
  }, [apiBaseUrl]);

  // Custom filter function to add 'Alte materii' option when no match is found
  const filterOptions = (options, { inputValue }) => {
    if (subjects.length === 0) {
      return options; // Do not add "Alte materii" if no subjects are fetched
    }

    const filtered = options.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    if (filtered.length === 0) {
      // Add 'Alte materii' if no matches are found, but only if subjects are available
      filtered.push({ id: null, name: "Alte materii" });
    }
    return filtered;
  };

  return (
    <Stack
      spacing={3}
      {...other}
    >
      <Stack spacing={2}>

        <Autocomplete
          disablePortal
          options={subjects} // Populate with subjects from API
          getOptionLabel={(option) => option.name || ''} // Map option to subject name
          loading={isLoadingSubjects} // Show a loading spinner if subjects are being fetched
          filterOptions={filterOptions} // Use custom filterOptions function
          noOptionsText={isLoadingSubjects ? 'Loading...' : 'No options'} // Default message when no subjects are found
          renderInput={(params) => (
            <TextField
              {...params}
              label="Materie"
              variant="outlined"
              fullWidth
              placeholder="Alege o materie"
              sx={{
                "& .MuiAutocomplete-input": {
                  fontSize: "unset !important",
                },
                "& .MuiOutlinedInput-root": {
                  padding: '7.5px 4px 3px 5px', // Consistent padding inside input
                  fontSize: "unset !important",
                },
              }}
            />
          )}
        />

      </Stack>
      <div>
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
          Înainte
        </Button>
      </div>
    </Stack>
  );
};

ChooseSubject.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};
