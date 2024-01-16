import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import React from "react";
import * as Yup from "yup";
import {useFormik} from "formik";
import {useMounted} from "../../hooks/use-mounted";
import {useRouter} from "../../hooks/use-router";
import {useSearchParams} from "../../hooks/use-search-params";
import {useAuth} from "../../hooks/use-auth";
import {paths} from "../../paths";
import {usePageView} from "../../hooks/use-page-view";
import {RouterLink} from "../../components/router-link";
import FormHelperText from "@mui/material/FormHelperText";


const initialValues = {
  email: 'demo@devias.io',
  password: 'Password123!',
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string().email('Adresa email nu este validă').max(255).required('Adresa email este obligatorie'),
  password: Yup.string().max(255).required('Password is required'),
});

export const Login = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const { issuer, signIn } = useAuth();
  const formik = useFormik({
    initialValues,
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
  return (
    <>
      <Card elevation={16}>
        <CardHeader
          subheader={
            <Typography
              color="text.secondary"
              variant="body2"
            >
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
          <form
            noValidate
            onSubmit={formik.handleSubmit}
          >
            <Stack spacing={3}>
              <TextField
                autoFocus
                error={!!(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Adresă email"
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
              fullWidth
              size="large"
              sx={{mt: 2}}
              type="submit"
              variant="contained"
            >
              Continuă
            </Button>
            <Box
              disabled={formik.isSubmitting}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 3,
              }}
            >
              <Link
                href="#"
                underline="hover"
                variant="subtitle2"
              >
                Ai uitat parola?
              </Link>
            </Box>
          </form>


          <div className="line-or-line">
            <hr className="line"/>
            <span className="word">SAU</span>
            <hr className="line"/>
          </div>
          <Button
            color="inherit"
            variant="outlined"
            sx={{
              width: '100%'
            }}
            startIcon={
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            }
          >
            Continuă cu Google
          </Button>
        </CardContent>
      </Card>

    </>
  )
}
