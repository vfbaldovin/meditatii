import * as Yup from 'yup';
import { useFormik } from 'formik';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { paths } from 'src/paths';
import Container from "@mui/material/Container";
import CardActionArea from "@mui/material/CardActionArea";
import {User03} from "@untitled-ui/icons-react";
import React from "react";
import {Google} from "@mui/icons-material";
import {Login} from "../auth/login";



const Page = () => {


  return (
    <>
      <Seo title="Login" />
        <Login></Login>
    </>
  );
};

export default Page;
