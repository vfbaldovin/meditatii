import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";

export const ChooseSubject = (props) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const { onBack, onNext, onSubjectSelect, selectedSubject, ...other } = props;
  const [subjects, setSubjects] = useState([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [alteMateriiId, setAlteMateriiId] = useState(null); // State to store "Alte materii" id


  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/dashboard/subjects/available`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        });

        const fetchedSubjects = response.data;
        setSubjects(fetchedSubjects); // Set subjects

        // Search for "Alte materii" in the fetched subjects
        const alteMateriiSubject = fetchedSubjects.find(
          (subject) => subject.name.toLowerCase() === 'alte materii'
        );

        // If found, set its ID, otherwise leave it null
        if (alteMateriiSubject) {
          setAlteMateriiId(alteMateriiSubject.id);
        }

      } catch (err) {
        console.error('Error fetching subjects:', err);
      } finally {
        setIsLoadingSubjects(false); // Stop loading
      }
    };

    fetchSubjects();
  }, [apiBaseUrl]);

  const handleSubjectChange = (event, newValue) => {
    onSubjectSelect(newValue);  // Call the callback to pass the selected subject up
    if (newValue) {
      onNext();  // Automatically move to the next step after selecting a subject
    }
  };

  const filterOptions = (options, { inputValue }) => {
    if (subjects.length === 0) {
      return options;
    }

    const filtered = options.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    if (filtered.length === 0) {
      // Push "Alte materii" with the found ID, or with null if not found
      filtered.push({ id: alteMateriiId || null, name: "Alte materii" });
    }

    return filtered;
  };

  return (
    <Stack spacing={3} {...other}>
      <Stack spacing={2}>
        <Autocomplete
          disablePortal
          options={subjects}
          getOptionLabel={(option) => option.name || ''}
          loading={isLoadingSubjects}
          filterOptions={filterOptions}
          noOptionsText={isLoadingSubjects ? 'Loading...' : 'No options'}
          onChange={handleSubjectChange}
          value={selectedSubject}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label={selectedSubject ? selectedSubject.name : 'Materie'} // Dynamically change label
              variant="outlined"
              fullWidth
              placeholder="Alege o materie"
              sx={{
                "& .MuiAutocomplete-input": {
                  fontSize: "unset !important",
                },
                "& .MuiOutlinedInput-root": {
                  padding: '7.5px 4px 3px 5px',
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
          disabled={!selectedSubject}  // Disable if no subject is selected
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
  onSubjectSelect: PropTypes.func.isRequired,
  selectedSubject: PropTypes.object, // Now required to check if it's selected
};
