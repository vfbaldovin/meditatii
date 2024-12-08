import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useAuth } from '../../../../hooks/use-auth';

export const ChooseSubject = (props) => {
  const { onBack, onNext, onSubjectSelect, selectedSubject, ...other } = props;
  const [subjects, setSubjects] = useState([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [alteMateriiId, setAlteMateriiId] = useState(null);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetchWithAuth(`/api/dashboard/subjects/available`);
        const fetchedSubjects = await response.json();

        // Ensure all IDs are strings to prevent type mismatches
        const normalizedSubjects = fetchedSubjects.map(subject => ({
          ...subject,
          id: String(subject.id),
        }));

        setSubjects(normalizedSubjects);

        const alteMateriiSubject = normalizedSubjects.find(
          (subject) => subject.name.toLowerCase() === 'alte materii'
        );

        if (alteMateriiSubject) {
          setAlteMateriiId(alteMateriiSubject.id);
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [] );

  const handleSubjectChange = (event, newValue) => {
    if (newValue) {
      const updatedSubject = {
        id: String(newValue.id), // Ensure ID is a string
        name: newValue.name,
      };
      onSubjectSelect(updatedSubject);
      onNext();
    }
  };

  const filterOptions = (options, { inputValue }) => {
    const filtered = options.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    if (filtered.length === 0) {
      filtered.push({ id: alteMateriiId ? String(alteMateriiId) : null, name: "Alte materii" });
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
          isOptionEqualToValue={(option, value) => option.id === value.id && option.name === value.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label={selectedSubject ? selectedSubject.name : 'Materie'}
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
          disabled={!selectedSubject}
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
  selectedSubject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }), // Expect selectedSubject to have id and name as strings
};
