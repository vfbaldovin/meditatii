import {useCallback, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {FileDropzone} from 'src/components/file-dropzone';
import {QuillEditor} from 'src/components/quill-editor';
import {useRouter} from 'src/hooks/use-router';
import {paths} from 'src/paths';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import InputAdornment from "@mui/material/InputAdornment";
import {Assistant} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {keyframes} from "@emotion/react";
import {styled, useTheme} from "@mui/material/styles";
import AnimatedAssistantIcon from "./animated-assistant-icon";

const colorChange = keyframes`
  0% { color: #00f; }     /* Blue */
  50% { color: #8a2be2; } /* BlueViolet */
  100% { color: #9370db; } /* MediumPurple */
`;

const initialValues = {
  barcode: '925487986526',
  category: '',
  description: '',
  images: [],
  name: '',
  newPrice: 0,
  oldPrice: 0,
  sku: 'IYV-8745',
  submit: null,
};

const validationSchema = Yup.object({
  barcode: Yup.string().max(255),
  category: Yup.string().max(255),
  description: Yup.string().max(5000),
  images: Yup.array(),
  name: Yup.string().max(255).required(),
  newPrice: Yup.number().min(0).required(),
  oldPrice: Yup.number().min(0),
  sku: Yup.string().max(255),
});


export const ListingCreateFormOld = (props) => {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [subjects, setSubjects] = useState([]);  // State to store subjects
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = sessionStorage.getItem('accessToken');


  // Fetch subjects on mount
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

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        toast.success('Product created');
        router.push(paths.dashboard.products.index);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({success: false});
        helpers.setErrors({submit: err.message});
        helpers.setSubmitting(false);
      }
    },
  });

  const handleFilesDrop = useCallback((newFiles) => {
    setFiles((prevFiles) => {
      return [...prevFiles, ...newFiles];
    });
  }, []);

  const handleFileRemove = useCallback((file) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
  }, []);

  const handleFilesRemoveAll = useCallback(() => {
    setFiles([]);
  }, []);

/*
  const GradientAnimatedIcon = styled(Assistant)({
    '& path': {
      fill: 'url(#animatedGradient)', // Use animated gradient for the fill
    },
    position: 'relative',
  });
*/
  const theme = useTheme();


  return (
    <form onSubmit={formik.handleSubmit} {...props}>
      <Stack spacing={4}>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Autocomplete
                disablePortal
                options={subjects} // Populate with subjects from API
                getOptionLabel={(option) => option.name || ''} // Map option to subject name
                loading={isLoadingSubjects} // Show a loading spinner if subjects are being fetched
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
              <TextField
                label="Descriere"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                InputProps={{
                  sx: {
                    "& .MuiInputBase-input": {
                      fontSize: 'unset !important', // Override the font size
                    },
                    "& .MuiOutlinedInput-input": {
                      fontSize: 'unset !important', // Ensure font size is overridden
                    },
                  },
                  endAdornment: (
                    <InputAdornment position="end">
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
                      <IconButton
                        onClick={() => {}} // Define your click handler function
                        aria-label="assistant-icon-button"
                      >
                        <AnimatedAssistantIcon fontSize="large" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  position: 'relative',
                }}
              />

              <TextField
                variant="outlined"
                error={!!(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Product Name"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <Stack spacing={1}>
                  <Typography variant="h6">Images</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Images will appear in the store front of your website.
                  </Typography>
                </Stack>
              </Grid>
              <Grid xs={12} md={8}>
                <FileDropzone
                  accept={{'image/*': []}}
                  caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                  files={files}
                  onDrop={handleFilesDrop}
                  onRemove={handleFileRemove}
                  onRemoveAll={handleFilesRemoveAll}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <Typography variant="h6">Pricing</Typography>
              </Grid>
              <Grid xs={12} md={8}>
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.oldPrice && formik.errors.oldPrice)}
                    fullWidth
                    label="Old price"
                    name="oldPrice"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.oldPrice}
                  />
                  <TextField
                    error={!!(formik.touched.newPrice && formik.errors.newPrice)}
                    fullWidth
                    label="New Price"
                    name="newPrice"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.newPrice}
                  />
                  <div>
                    <FormControlLabel
                      control={<Switch defaultChecked/>}
                      label="Keep selling when stock is empty"
                    />
                  </div>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <Typography variant="h6">Category</Typography>
              </Grid>
              <Grid xs={12} md={8}>
                <Stack spacing={3}>
                  {/*<TextField
                    error={!!(formik.touched.category && formik.errors.category)}
                    fullWidth
                    label="Category"
                    name="category"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    value={formik.values.category}
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>*/}
                  <TextField
                    disabled
                    error={!!(formik.touched.barcode && formik.errors.barcode)}
                    fullWidth
                    label="Barcode"
                    name="barcode"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.barcode}
                  />
                  <TextField
                    disabled
                    error={!!(formik.touched.sku && formik.errors.sku)}
                    fullWidth
                    label="SKU"
                    name="sku"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.sku}
                  />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Stack alignItems="center" direction="row" justifyContent="flex-end" spacing={1}>
          <Button color="inherit">Cancel</Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
