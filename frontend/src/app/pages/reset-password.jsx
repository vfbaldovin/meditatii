import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'src/hooks/use-router';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import Confetti from 'react-confetti';
import { useParams } from "react-router";
import axios from "axios";
import Link from '@mui/material/Link';
import { paths } from 'src/paths';
import { RouterLink } from 'src/components/router-link';

const ResetPasswordPage = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const { token } = useParams();
  const router = useRouter();
  const [tokenValid, setTokenValid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null); // Email state
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showConfetti, setShowConfetti] = useState(true);
  const [showRetryLink, setShowRetryLink] = useState(false);

  // Token validation logic
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/auth/validateToken/${token}`);
        if (response.status === 200) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
      } catch {
        setTokenValid(false); // No logs, just handle state
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token, apiBaseUrl]);

  // Formik setup for password reset
  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().min(7, 'Parola trebuie să aibă minim 7 caractere').required('Parola este obligatorie'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/auth/changePassword`, {
          token,
          password: values.password
        });

        if (response && response.data && response.data.message) {
          setEmail(response.data.message);
          setIsResetSuccessful(true);

          // Hide confetti after 3 seconds
          setTimeout(() => {
            setShowConfetti(false);
          }, 2500);
        } else {
          helpers.setErrors({ submit: 'Failed to reset password. Please try again.' });
          setShowRetryLink(true);
        }
      } catch {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: 'An error occurred. Please try again.' });
        setShowRetryLink(true);  // Show retry link on error
      }
    },
  });

  // Countdown timer for redirection
  useEffect(() => {
    if (isResetSuccessful) {
      const intervalId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        router.push(`/login?email=${email}`);
      }

      return () => clearInterval(intervalId);
    }
  }, [isResetSuccessful, countdown, email, router]);

  // Display loading while validating the token
  if (loading) {
    return <Typography>Validating token...</Typography>;
  }

  // Handle invalid or expired token with a sad face and "Ooups" message
  if (!tokenValid) {
    return (
      <Card elevation={16} sx={{ textAlign: 'center', padding: 3 }}>
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            Oopsie! 😞
          </Typography>
          <Typography variant="h6" component="div" gutterBottom>
            Token invalid sau expirat.
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            Tokenul pe care l-ai folosit este fie invalid, fie expirat.
          </Typography>
          <Link
            component={RouterLink}
            href={paths.auth.jwt.recoverPassword}
            underline="hover"
            variant="subtitle2"
          >
            Resetează parola din nou.
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Render the password reset form if the token is valid
  return (
    <div>
      {isResetSuccessful ? (
        <Card elevation={16} sx={{ textAlign: 'center', padding: 3 }}>
          {showConfetti && <Confetti numberOfPieces={300} gravity={0.3} />}
          <CardContent>
            <Typography variant="h4" component="div" gutterBottom>
              Hooray! 🎉
            </Typography>
            <Typography variant="h6" component="div" gutterBottom>
              Parola a fost resetată cu succes.
            </Typography>
            <Typography variant="h6" component="div" gutterBottom>
              Vei fi redirecționat către pagina de autentificare în {countdown} secunde.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => router.push(`/login?email=${email}`)}
            >
              Mergi la autentificare acum
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card elevation={16}>
          <CardContent>
            <Typography variant="h4" component="div" gutterBottom>
              Resetează parola
            </Typography>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Parola nouă"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
              {formik.errors.submit && (
                <>
                  <FormHelperText
                    error
                    sx={{ mt: 3 }}
                  >
                    {formik.errors.submit}
                  </FormHelperText>
                  {showRetryLink && (
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      sx={{ mt: 2 }}
                    >
                      <Link
                        component={RouterLink}
                        href={paths.auth.jwt.recoverPassword}
                        underline="hover"
                        variant="subtitle2"
                      >
                        Resetează parola din nou.
                      </Link>
                    </Typography>
                  )}
                </>
              )}
              <Button
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                type="submit"
                variant="contained"
              >
                Înainte
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResetPasswordPage;
