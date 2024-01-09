import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import CloseIcon from '@mui/icons-material/Close';

export const CourseSearch = ({ onSubjectSelect, searchTextDefault, onUpdateSearchText }) => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [firstResult, setFirstResult] = useState(null);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const debounceTimeoutRef = useRef(null);

  const keyPressRef = useRef(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setSearchText(searchTextDefault || '');
  }, [searchTextDefault]);

  const debounce = (func, delay) => {
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(func, delay);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchText.length >= 2) {
        try {
          console.log(results)
          console.log(firstResult)
          const response = await axios.get(`${apiBaseUrl}/api/subject/search?q=${searchText}`);
          setResults(response.data);
          setFirstResult(response.data[0] || null);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      } else {
        setResults([]);
        setFirstResult(null);
      }
    };

    if (searchText.length >= 2) {
      debounce(() => {
        setIsDebouncing(false);
        fetchSearchResults();
      }, 300); // 500ms debounce time
      setIsDebouncing(true);
    } else if (results.length !== 0) {
      clearTimeout(debounceTimeoutRef.current);
      setIsDebouncing(false);
      setResults([]);
      setFirstResult(null);
    }
    }, [searchText, apiBaseUrl]);


  const handleInputChange = (event, value, reason) => {
    if (reason === 'input') {
      setSearchText(value);
    }
  };

  const handleClear = () => {
    setSearchText('');
    // onUpdateSearchText('');
  };

  const handleSearch = (e) => {
    if (firstResult) {
      setSearchText(firstResult.name);
      onSubjectSelect(firstResult);
      onUpdateSearchText(firstResult.name);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && firstResult) {
      keyPressRef.current = true;
      event.preventDefault();
      setSearchText(firstResult.name);
      onSubjectSelect(firstResult);

      onUpdateSearchText(firstResult.name);
    }
  };

  const handleSelect = (event, value) => {
    if (searchText.length < 2) {
      return;
    }

    if (keyPressRef.current) {
      keyPressRef.current = false;
      return;
    }
    if (value && results.length !== 0) {
      onSubjectSelect(value);
      onUpdateSearchText(value.name);
    }
  };


  return (
    <Card className="search-card" sx={{ borderRadius: '5rem'}}>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={0}
        sx={{ p: 0 }}
      >
        <Box sx={{ flexGrow: 1 }}>
        <Autocomplete
          sx={{
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                border: 'unset'
              },
          }}
          freeSolo
          options={results}
          getOptionLabel={(option) => option.name || ''}
          onInputChange={handleInputChange}
          onChange={handleSelect}
          inputValue={searchText}
          onKeyDown={handleKeyPress}
          PaperComponent={({ children, ...other }) => (
            <Paper {...other} sx={{
              width: '92.8%',
              transform: 'translateX(4%)',
            }}>
              {children}
            </Paper>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              placeholder="Ce ți-ar plăcea să înveți?"
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                maxLength: 32,
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {searchText && (
                      <IconButton onClick={handleClear} sx={{ fontSize: '1.4rem' }}>
                        <CloseIcon sx={{ fontSize: 'inherit' }} />
                      </IconButton>
                    )}

                    <IconButton
                      onClick={handleSearch}
                      sx={{
                        backgroundColor: 'primary.main',
                        color: (theme) => (theme.palette.mode === 'light' ? 'white' : 'black'),
                        opacity: 0.9,
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          opacity: 1,
                          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
                        },
                      }}
                    >
                      <SearchMdIcon />
                    </IconButton>
                  </React.Fragment>

                ),
                style: {
                  borderRadius: '5rem',
                  padding: '0.85rem',
                },
              }}
            />
          )}
        />
        </Box>
      </Stack>
    </Card>
  );
};
