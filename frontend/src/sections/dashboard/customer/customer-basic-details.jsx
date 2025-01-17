import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';

import { PropertyList } from 'src/components/property-list';
import { PropertyListItem } from 'src/components/property-list-item';
import Mail01Icon from "@untitled-ui/icons-react/build/esm/Mail01";
import {PropertyAccountItem} from "../account/property-account-item";
import Briefcase01Icon from "@untitled-ui/icons-react/build/esm/Briefcase01";
import Home02Icon from "@untitled-ui/icons-react/build/esm/Home02";
import BookOpen01Icon from "@untitled-ui/icons-react/build/esm/BookOpen01";
import React from "react";
import {BarChart05, PhoneCall01, Star01, User01} from "@untitled-ui/icons-react";
import Archive from "@untitled-ui/icons-react/build/esm/Archive";
import CalendarIcon from "@untitled-ui/icons-react/build/esm/Calendar";
import {RouterLink} from "../../../components/router-link";
import SvgIcon from "@mui/material/SvgIcon";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import {paths} from "../../../paths";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import {ProfileCompleteProgress} from "../academy/profile-complete-progress";
import Box from "@mui/material/Box";

export const CustomerBasicDetails = (props) => {
  const { address1, address2, country, email, isVerified, phone, state, ...other } = props;

  return (
    <Card {...other}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // Ensures even spacing between the header and button
          alignItems: 'center',           // Vertically aligns items on the same line
          padding: 2,                     // Adds some padding for layout
        }}
      >
        <CardHeader title="Detalii Personale" sx={{ p: 1 }} /> {/* Remove default padding */}
        <Button
          color="inherit"
          // variant="outlined"
          component={RouterLink}
          startIcon={
            <SvgIcon>
              <Edit02Icon />
            </SvgIcon>
          }
          href={paths.dashboard.customers.edit}
        >
          Modifică
        </Button>
      </Box>
      <PropertyList>
        <PropertyAccountItem
          icon={<Mail01Icon />}
          label="Email"
          value="user@example.com"
        />
        <PropertyAccountItem
          icon={<Briefcase01Icon />}
          label="Profesie"
          value="Profesor"
        />
        <PropertyAccountItem
          icon={<Home02Icon />}
          label="Locație"
          value="Locație"
        />
        <PropertyAccountItem
          icon={<BookOpen01Icon />}
          label="Studii"
          value="studii"
        />
        <PropertyAccountItem
          icon={<PhoneCall01 />}
          label="Telefon"
          value="0743"
        />
        <PropertyAccountItem
          icon={<CalendarIcon />}
          label="Data nașterii"
          value="vrst"
        />

        <PropertyAccountItem
          icon={<Star01/>}
          label="Experiență"
          value="Profesor"
          noDivider={true}
        />
      </PropertyList>
      {/*<CardActions*/}
      {/*>*/}
      {/*  <Button*/}
      {/*    color="inherit"*/}
      {/*    component={RouterLink}*/}
      {/*    endIcon={*/}
      {/*      <SvgIcon>*/}
      {/*        <Edit02Icon />*/}
      {/*      </SvgIcon>*/}
      {/*    }*/}
      {/*    href={paths.dashboard.customers.edit}*/}
      {/*  >*/}
      {/*    Modifică detalii personale*/}
      {/*  </Button>*/}

      {/*</CardActions>*/}
    </Card>
  );
};

CustomerBasicDetails.propTypes = {
  address1: PropTypes.string,
  address2: PropTypes.string,
  country: PropTypes.string,
  email: PropTypes.string.isRequired,
  isVerified: PropTypes.bool.isRequired,
  phone: PropTypes.string,
  state: PropTypes.string,
};
