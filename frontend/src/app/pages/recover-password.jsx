import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { useAuth } from 'src/hooks/use-auth';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { paths } from 'src/paths';
import GoogleSignInButton from "../auth/google-sign-in";
import React, { useState, useEffect } from "react";
import Confetti from 'react-confetti';
import SvgIcon from "@mui/material/SvgIcon";
import { ArrowBack } from "@mui/icons-material";

const initialValues = {
  email: '',
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string().email('Adresa email nu este validă').max(255).required('Adresa email este obligatorie'),
});

const Page = () => {
  const isMounted = useMounted();
  const { resetPassword } = useAuth();
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await resetPassword({ email: values.email });
        setResetEmail(values.email);
        setIsResetSuccessful(true);
        setShowConfetti(true);
      } catch (err) {
        console.error(err);
        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  usePageView();

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 2500); // Show confetti for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <>
      <Seo title="Recuperare parolă" />
      <div>
        {showConfetti && <Confetti numberOfPieces={300} gravity={0.3} />}
        {!isResetSuccessful ? (
          <Card elevation={16}>
            <CardHeader
              subheader={
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Ți-ai amintit parola? &nbsp;
                  <Link
                    component={RouterLink}
                    href={paths.auth.jwt.login}
                    underline="hover"
                    variant="subtitle2"
                  >
                    Autentificare
                  </Link>
                </Typography>
              }
              sx={{ pb: 0 }}
              title="Recuperare parolă"
            />
            <CardContent>
              <form noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                  />
                </Stack>
                {formik.errors.submit && (
                  <FormHelperText
                    error
                    sx={{ mt: 3 }}
                  >
                    {formik.errors.submit}
                  </FormHelperText>
                )}
                <Button
                  disabled={formik.isSubmitting}
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                  type="submit"
                  variant="contained"
                >
                  Recuperare parolă
                </Button>
              </form>
              <div className="line-or-line">
                <hr className="line" />
                <span className="word">SAU</span>
                <hr className="line" />
              </div>

              <GoogleSignInButton />
            </CardContent>
          </Card>
        ) : (
          <Card elevation={16} sx={{ textAlign: 'center', padding: 3 }}>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom sx={{ mb: 3 }}>
                Hooray! 🎉
              </Typography>
              <Typography variant="h6" component="div" gutterBottom>
                A fost trimis un email pentru resetarea parolei la
                <Typography variant="h6" component="span" color="primary.main">
                  <strong> {resetEmail}</strong>
                </Typography>{" "}
              </Typography>
              <Typography variant="h6" component="div" gutterBottom sx={{ mb: 3 }}>
                Verificați adresa de email pentru link-ul de resetare a parolei. Acest link expiră într-o oră.
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Dacă întâmpinați probleme, vă rugăm să ne contactați la{" "}
                <Link href="mailto:contact@meditatiianunturi.ro" color="primary.main">
                  <strong>contact@meditatiianunturi.ro</strong>
                </Link>
              </Typography>

              <Button
                color="inherit"
                variant="outlined"
                onClick={() => window.location.href = '/'}
                sx={{ mt: 4 }}
                startIcon={
                  <SvgIcon fontSize="small">
                    <ArrowBack />
                  </SvgIcon>
                }
              >
                Înapoi la pagina principală
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default Page;
