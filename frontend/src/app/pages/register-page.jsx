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
import { useRouter } from 'src/hooks/use-router';
import { useSearchParams } from 'src/hooks/use-search-params';
import { paths } from 'src/paths';
import React, { useState, useEffect } from "react";
import GoogleSignInButton from "../auth/google-sign-in";
import Confetti from 'react-confetti';
import SvgIcon from "@mui/material/SvgIcon";
import {User03} from "@untitled-ui/icons-react";
import ArrowBlockLeft from "@untitled-ui/icons-react/build/cjs/ArrowBlockLeft";
import {ArrowBack, ArrowLeft} from "@mui/icons-material";

const initialValues = {
  email: '',
  password: '',
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string().email('Adresa email nu este validă').max(255).required('Adresa email este obligatorie'),
  password: Yup.string().min(7).max(255).required('Setați o parolă'),
});

const Page = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const { signUp } = useAuth();

  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await signUp(values.email, values.password);
        setRegisteredEmail(values.email);
        setIsRegistered(true);
        setShowConfetti(true); // Trigger confetti
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
      }, 2500); // Show confetti for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <>
      <Seo title="Creează un cont" />
      <div>
        {showConfetti && <Confetti numberOfPieces={300} gravity={0.3} />}
        {!isRegistered ? (
          <Card elevation={16}>
            <CardHeader
              subheader={
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Ai deja un cont? &nbsp;
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
              title="Creează un cont"
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
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Parolă"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
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
                  Înainte
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
                <Typography variant="h6" component="span" color="primary.main">
                  <strong>{registeredEmail}</strong>
                </Typography>{" "}
                a fost înregistrat.
              </Typography>
              <Typography variant="h6" component="div" gutterBottom sx={{ mb: 3 }}>
                Verificați adresa de email în inbox și spam pentru activarea contului.
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
                onClick={() => router.push('/')}
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
