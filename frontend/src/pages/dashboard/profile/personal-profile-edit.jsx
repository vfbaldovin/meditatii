import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import Link from "@mui/material/Link";
import {RouterLink} from "../../../components/router-link";
import {paths} from "../../../paths";
import SvgIcon from "@mui/material/SvgIcon";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { parseISO } from 'date-fns';
import toast from "react-hot-toast";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers";
import { useAuth } from '../../../hooks/use-auth';
import {useRouter} from "../../../hooks/use-router";

const Page = () => {
  const { fetchWithAuth } = useAuth();
  const [initialValues, setInitialValues] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth('/api/dashboard/profile/info');
        if (!response.ok) {
          throw new Error('Failed to fetch profile information');
        }
        const data = await response.json(); // Extract the JSON data from the response
        console.log('Fetched data:', data); // Debug the extracted data
        setInitialValues({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          occupation: data.occupation || '',
          education: data.education || '',
          experience: data.experience || '',
          phone: data.phone || '',
          city: data.city || '',
          dateOfBirth: data.dateOfBirth ? parseISO(data.dateOfBirth) : null,
        });
      } catch (error) {
        console.error('Failed to fetch profile info:', error);
      }
    };

    fetchData();
  }, [fetchWithAuth]);



  const formik = useFormik({
    initialValues: initialValues || {
      firstName: '',
      lastName: '',
      occupation: '',
      education: '',
      experience: '',
      phone: '',
      city: '',
      dateOfBirth: null,
      submit: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      occupation: Yup.string().max(70),
      experience: Yup.string()
        .oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '15', '20', '30', null, ''])
        .nullable(),
      phone: Yup.string().max(15),
      city: Yup.string()
        .oneOf([
          'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brăila', 'Brașov', 'București',
          'Buzău', 'Călărași', 'Caraș-Severin', 'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
          'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș', 'Mehedinți', 'Mureș', 'Neamț',
          'Olt', 'Prahova', 'Sălaj', 'Satu Mare', 'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea',
          null, '',
        ])
        .nullable(),
    }),
    onSubmit: async (values, helpers) => {
      // Replace empty strings with null
      const processedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value === '' ? null : value])
      );

      try {
        const response = await fetchWithAuth('/api/dashboard/profile/info/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(processedValues),
        });

        if (response.ok) {
          helpers.setStatus({ success: true });
          toast.success('Detaliile personale au fost salvate');
          router.push(paths.dashboard.index);
        } else {
          throw new Error('Failed to save profile information');
        }
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });


  if (!initialValues) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Seo title="Profil personal" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <div>
            <Link
              color="text.primary"
              component={RouterLink}
              href={paths.dashboard.index}
              sx={{
                alignItems: 'center',
                display: 'inline-flex',
                mb:3
              }}
              underline="hover"
            >
              <SvgIcon sx={{mr: 1}}>
                <ArrowLeftIcon/>
              </SvgIcon>
              <Typography variant="subtitle2">Înapoi</Typography>
            </Link>
          </div>
          <form
            onSubmit={formik.handleSubmit}
          >

            <Card>
              <CardHeader title="Modifică detalii personale"/>
              <CardContent sx={{pt: 0}}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    xs={12}
                    md={6}
                  >
                    <TextField
                      error={!!(formik.touched.firstName && formik.errors.firstName)}
                      fullWidth
                      helperText={formik.touched.firstName && formik.errors.firstName}
                      label="Prenume"
                      name="firstName"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.firstName}
                      inputProps={{
                        maxLength: 40,
                      }}
                    />
                  </Grid>
                  <Grid
                    xs={12}
                    md={6}
                  >
                    <TextField
                      error={!!(formik.touched.lastName && formik.errors.lastName)}
                      fullWidth
                      helperText={formik.touched.lastName && formik.errors.lastName}
                      label="Nume"
                      name="lastName"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.lastName}
                      inputProps={{
                        maxLength: 40,
                      }}
                    />
                  </Grid>
                  <Grid
                    xs={12}
                    md={6}
                  >
                    <TextField
                      error={!!(formik.touched.occupation && formik.errors.occupation)}
                      fullWidth
                      helperText={formik.touched.occupation && formik.errors.occupation}
                      label="Profesie"
                      name="occupation"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.occupation}
                      inputProps={{
                        maxLength: 70,
                      }}
                    />
                  </Grid>
                  <Grid
                    xs={12}
                    md={6}
                  >
                    <TextField
                      error={!!(formik.touched.education && formik.errors.education)}
                      fullWidth
                      helperText={formik.touched.education && formik.errors.education}
                      label="Studii"
                      name="education"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.education}
                      inputProps={{
                        maxLength: 100,
                      }}
                    />
                  </Grid>
                  <Grid
                    xs={12}
                    md={6}
                  >
                    <TextField
                      select
                      error={!!(formik.touched.experience && formik.errors.experience)}
                      fullWidth
                      helperText={formik.touched.experience && formik.errors.experience}
                      label="Experiență"
                      name="experience"
                      onBlur={formik.handleBlur}
                      onChange={(event) => {
                        const value = event.target.value === '' ? null : event.target.value;
                        formik.setFieldValue('experience', value);
                      }}
                      value={formik.values.experience || ''}
                    >
                      <MenuItem value="">necompletat</MenuItem> {/* Empty option */}
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '15', '20', '30'].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option} {option === '1' ? 'an' : 'ani'}
                        </MenuItem>
                      ))}
                    </TextField>


                  </Grid>
                  <Grid
                    xs={12}
                    md={6}
                  >
                    <TextField
                      error={!!(formik.touched.phone && formik.errors.phone)}
                      fullWidth
                      helperText={formik.touched.phone && formik.errors.phone}
                      label="Telefon"
                      name="phone"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.phone}
                      inputProps={{
                        maxLength: 15,
                      }}
                      onInput={(e) => {
                        const input = e.target;
                        input.value = input.value
                          .replace(/[^\d+]/g, '') // Remove all characters except digits and +
                          .replace(/(?!^)[+]/g, '') // Remove any + that is not the first character
                          .replace(/^(?!\+|\d).*$/, ''); // Ensure the first character is + or a digit
                      }}
                    />
                  </Grid>
                  <Grid
                    xs={12}
                    md={6}
                  >
                    <TextField
                      select
                      error={!!(formik.touched.city && formik.errors.city)}
                      fullWidth
                      helperText={formik.touched.city && formik.errors.city}
                      label="Locație"
                      name="city"
                      onBlur={formik.handleBlur}
                      onChange={(event) => {
                        const value = event.target.value === '' ? null : event.target.value;
                        formik.setFieldValue('city', value);
                      }}
                      value={formik.values.city || ''}
                    >
                      <MenuItem value="">necompletat</MenuItem> {/* Empty option */}
                      {[
                        'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brăila', 'Brașov',
                        'București', 'Buzău', 'Călărași', 'Caraș-Severin', 'Cluj', 'Constanța', 'Covasna', 'Dâmbovița',
                        'Dolj', 'Galați', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov',
                        'Maramureș', 'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Sălaj', 'Satu Mare', 'Sibiu',
                        'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea',
                      ].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid
                    xs={12}
                    md={6}
                  >
                    <DatePicker
                      format="dd/MM/yyyy"
                      label="Data nașterii"
                      maxDate={new Date()} // Set maximum date to today
                      onChange={(value) => formik.setFieldValue('dateOfBirth', value)}
                      value={formik.values.dateOfBirth}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!(formik.touched.dateOfBirth && formik.errors.dateOfBirth),
                          helperText: formik.touched.dateOfBirth && formik.errors.dateOfBirth,
                        },
                      }}
                    />

                  </Grid>
                </Grid>
              </CardContent>
              <Stack
                direction={{
                  xs: 'column',
                  sm: 'row',
                }}
                flexWrap="wrap"
                spacing={3}
                sx={{p: 3}}
              >
                <Button
                  disabled={formik.isSubmitting || !formik.dirty}
                  type="submit"
                  variant="contained"
                >
                  Salvează
                </Button>

              </Stack>
            </Card>
          </form>
        </Container>

      </Box>
    </>
  );
};

export default Page;
