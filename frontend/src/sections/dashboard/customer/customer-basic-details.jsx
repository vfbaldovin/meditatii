import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import { PropertyList } from 'src/components/property-list';
import { PropertyAccountItem } from '../account/property-account-item';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Briefcase01Icon from '@untitled-ui/icons-react/build/esm/Briefcase01';
import BookOpen01Icon from '@untitled-ui/icons-react/build/esm/BookOpen01';
import { PhoneCall01, Star01 } from "@untitled-ui/icons-react";
import Home02Icon from '@untitled-ui/icons-react/build/esm/Home02';
import CalendarIcon from '@untitled-ui/icons-react/build/esm/Calendar';
import SvgIcon from '@mui/material/SvgIcon';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import { paths } from '../../../paths';
import { useAuth } from '../../../hooks/use-auth';
import Typography from "@mui/material/Typography";

export const CustomerBasicDetails = (props) => {
  const { onCompletionPercentage, ...rest } = props; // Remove `onCompletionPercentage`

  const { fetchWithAuth } = useAuth();
  const [personalInfo, setPersonalInfo] = useState({
    nume: 'necompletat',
    profesie: 'necompletat',
    studii: 'necompletat',
    experienta: 'necompletat',
    telefon: 'necompletat',
    locatie: 'necompletat',
    dataNasterii: 'necompletat',
  });

  // Fetch data from backend
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const response = await fetchWithAuth('/api/dashboard/profile/info');
        const data = await response.json();

        setPersonalInfo({
          nume: (data.firstName || data.lastName)
            ? `${data.firstName || ''} ${data.lastName || ''}`.trim()
            : 'necompletat',
          profesie: data.occupation || 'necompletat',
          studii: data.education || 'necompletat',
          experienta: data.experience || 'necompletat',
          telefon: data.phone || 'necompletat',
          locatie: data.city || 'necompletat',
          dataNasterii: data.dateOfBirth || 'necompletat',
        });
      } catch (error) {
        console.error('Error fetching personal info:', error);
      }
    };

    fetchPersonalInfo();
  }, [fetchWithAuth]);

  // Calculate completion percentage
  const calculateCompletionPercentage = () => {
    const fields = Object.values(personalInfo);
    const totalFields = fields.length;
    const completedFields = fields.filter((value) => value !== 'necompletat').length;
    return Math.round((completedFields / totalFields) * 100);
  };

  // Calculate age based on data nașterii
// Calculate age in years based on data nașterii
  const calculateAge = (dateOfBirth) => {
    if (dateOfBirth === 'necompletat') {
      return 'necompletat';
    }

    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate)) {
      return 'necompletat'; // Handle invalid date format
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust if the birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }

    return `${age} ani`; // Append " ani" after the age
  };

  // Pass percentage to props callback if provided
  // useEffect(() => {
  //   if (props.onCompletionPercentage) {
  //     props.onCompletionPercentage(calculateCompletionPercentage());
  //   }
  // }, [personalInfo, props]);
  useEffect(() => {
    if (onCompletionPercentage) {
      onCompletionPercentage(calculateCompletionPercentage());
    }
  }, [personalInfo, onCompletionPercentage]);

  const renderValue = (value) => (
    <Typography
      sx={{
        fontStyle: value === 'necompletat' ? 'italic' : 'normal',
        transform: value === 'necompletat' ? 'skewX(-5deg)' : 'none',
      }}
    >
      {value}
    </Typography>
  );

  return (
    <Card {...rest}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <CardHeader title="Profil personal" sx={{ p: 1 }} />
        <Button
          color="inherit"
          component="a"
          startIcon={
            <SvgIcon>
              <Edit02Icon />
            </SvgIcon>
          }
          href={paths.dashboard.profileEdit}
        >
          Modifică
        </Button>
      </Box>
      <PropertyList>
        <PropertyAccountItem
          icon={<PersonOutlineIcon />}
          label="Nume"
          value={renderValue(personalInfo.nume)}
        />
        <PropertyAccountItem
          icon={<PhoneCall01 />}
          label="Telefon"
          value={renderValue(personalInfo.telefon)}
        />
        <PropertyAccountItem
          icon={<CalendarIcon />}
          label="Vârstă"
          value={renderValue(calculateAge(personalInfo.dataNasterii))}
          noDivider
        />
        <PropertyAccountItem
          icon={<Home02Icon />}
          label="Locație"
          value={renderValue(personalInfo.locatie)}
        />
        <PropertyAccountItem
          icon={<Star01 />}
          label="Experiență"
          value={
            personalInfo.experienta === "necompletat"
              ? renderValue(personalInfo.experienta)
              : renderValue(
                `${personalInfo.experienta} ${
                  personalInfo.experienta == 1 ? "an" : "ani"
                }`
              )
          }
        />
        <PropertyAccountItem
          icon={<Briefcase01Icon />}
          label="Profesie"
          value={renderValue(personalInfo.profesie)}
        />
        <PropertyAccountItem
          icon={<BookOpen01Icon />}
          label="Studii"
          value={renderValue(personalInfo.studii)}
        />
      </PropertyList>
    </Card>
  );
};

CustomerBasicDetails.propTypes = {
  // address1: PropTypes.string,
  // address2: PropTypes.string,
  // country: PropTypes.string,
  // email: PropTypes.string.isRequired,
  // isVerified: PropTypes.bool.isRequired,
  // phone: PropTypes.string,
  // state: PropTypes.string,
};
