import React, {useEffect, useRef, useState} from "react";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { useMounted } from "../../hooks/use-mounted";
import { useRouter } from "../../hooks/use-router";
import { useSearchParams } from "../../hooks/use-search-params";
import { useAuth } from "../../hooks/use-auth";
import { paths } from "../../paths";
import { usePageView } from "../../hooks/use-page-view";
import { RouterLink } from "../../components/router-link";
import FormHelperText from "@mui/material/FormHelperText";
import GoogleSignInButton from "./google-sign-in";
import { useParams } from "react-router";
import Confetti from "react-confetti";


const validationSchema = Yup.object({
  email: Yup.string()
    .email('Adresa email nu este validă')
    .max(255)
    .required('Adresa email este obligatorie'),
  password: Yup.string().max(255).required('Password is required'),
});

export const Login = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const isMounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const { issuer, signIn } = useAuth();
  const { token } = useParams();
  const emailFromQuery = searchParams.get('email') || '';
  const passwordRef = useRef(null);


  const [verificationStatus, setVerificationStatus] = useState(null); // Tracks success or error
  const [verificationMessage, setVerificationMessage] = useState(''); // Message to display
  const [registeredEmail, setRegisteredEmail] = useState(''); // Tracks the email from the response
  const [showConfetti, setShowConfetti] = useState(false); // Confetti state

  // Handle account verification if token is present
  useEffect(() => {
    const verifyAccount = async () => {
      if (token) {
        try {
          const response = await axios.get(`${apiBaseUrl}/api/auth/accountVerification/${token}`);
          setVerificationStatus('success');
          setRegisteredEmail(response.data.message); // Assuming the email is returned in the 'message' key
          setVerificationMessage('a fost activat cu succes.');
          setShowConfetti(true); // Trigger confetti on success
        } catch (error) {
          console.error("Account verification failed", error);
          setVerificationStatus('error');
          setVerificationMessage(error.response?.data?.message || "A apărut o eroare în timpul verificării contului.");
        }
      }
    };
    verifyAccount();
  }, [token]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000); // Show confetti for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  useEffect(() => {
    if (emailFromQuery && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [emailFromQuery]);

  const formik = useFormik({
      initialValues: {
        email: emailFromQuery,  // Pre-populate email if present in query params
        password: '',
        submit: null,
      },
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await signIn(values.email, values.password);

        if (isMounted()) {
          router.push(returnTo || paths.dashboard.index);
        }
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

  // Render based on verification status
  if (verificationStatus === 'success') {
    return (
      <>
        {showConfetti && <Confetti numberOfPieces={300} gravity={0.3} />}
        <Card elevation={16} sx={{ textAlign: 'center', padding: 3 }}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Hooray! 🎉
            </Typography>
            <Typography variant="h6" component="div" gutterBottom>
              <Typography variant="h6" component="span" color="primary.main">
                <strong>{registeredEmail}</strong>
              </Typography>{" "}
              {verificationMessage}
            </Typography>
            <Typography variant="h6" component="div" gutterBottom sx={{ mb: 3 }}>
              Pentru a vă accesa contul, va rugăm să va autentificați.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Dacă întâmpinați probleme, vă rugăm să ne contactați la{" "}
              <Link href="mailto:contact@meditatiianunturi.ro" color="primary.main">
                <strong>contact@meditatiianunturi.ro</strong>
              </Link>
            </Typography>
            <Button
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => window.location.replace(`/login?email=${encodeURIComponent(registeredEmail)}`)}
            >
              Autentificare
            </Button>

          </CardContent>
        </Card>

      </>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <Card elevation={16} sx={{ textAlign: 'center', padding: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Oops! 😔
          </Typography>
          <Typography variant="h6" component="div" gutterBottom>
            Activarea contului nu a avut succes.
          </Typography>
          <Typography variant="h6" component="div" gutterBottom sx={{ mb: 3 }}>
            Vă rugăm să vă înregistrați din nou.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Dacă întâmpinați probleme, vă rugăm să ne contactați la{" "}
            <Link href="mailto:contact@meditatiianunturi.ro" color="primary.main">
              <strong>contact@meditatiianunturi.ro</strong>
            </Link>
          </Typography>
          <Button
            fullWidth
            size="large"
            sx={{ mt: 2 }}
            variant="contained"
            onClick={() => router.push('/register')}
          >
            Înregistrare
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={16}>
      <CardHeader
        subheader={
          <Typography color="text.secondary" variant="body2">
            Nu ai un cont? &nbsp;
            <Link
              component={RouterLink}
              href={paths.auth.jwt.register}
              underline="hover"
              variant="subtitle2"
            >
              Înregistrare
            </Link>
          </Typography>
        }
        sx={{ pb: 0 }}
        title="Autentificare"
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
              inputRef={passwordRef}
            />
          </Stack>
          {formik.errors.submit && (
            <FormHelperText error sx={{ mt: 3 }}>
              {formik.errors.submit}
            </FormHelperText>
          )}
          <Button
            fullWidth
            size="large"
            sx={{ mt: 2 }}
            type="submit"
            variant="contained"
          >
            Înainte
          </Button>
          <Box
            disabled={formik.isSubmitting}
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Link
              component={RouterLink}
              href={paths.auth.jwt.recoverPassword}
              underline="hover"
              variant="subtitle2">
              Ai uitat parola?
            </Link>
          </Box>
        </form>

        <div className="line-or-line">
          <hr className="line" />
          <span className="word">SAU</span>
          <hr className="line" />
        </div>

        <GoogleSignInButton />
      </CardContent>
    </Card>
  );
};
