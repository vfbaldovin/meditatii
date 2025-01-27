import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Seo} from 'src/components/seo';
import {useAuth} from 'src/hooks/use-auth';
import Grid from "@mui/material/Unstable_Grid2";
import SvgIcon from "@mui/material/SvgIcon";
import {useTheme} from "@mui/material/styles";
import Link from "@mui/material/Link";
import {RouterLink} from "../../../components/router-link";
import {paths} from "../../../paths";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import {ChooseDescription} from "./steps/choose-description";
import {ChoosePrice} from "./steps/choose-price";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Avatar from "@mui/material/Avatar";
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const StepIcon = ({ active, completed, icon }) => (
  <Avatar
    sx={{
      height: 40,
      width: 40,
      ...(active || completed ? { backgroundColor: 'primary.main', color: 'primary.contrastText' } : {}),
    }}
    variant="rounded"
  >
    {completed ? <SvgIcon><CheckIcon /></SvgIcon> : icon}
  </Avatar>
);

StepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node.isRequired,
};

const EditPage = () => {
  const {id} = useParams();
  const {search} = useLocation();
  const {fetchWithAuth} = useAuth();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [listingId, setListingId] = useState('');

  const wallpapers = [
    // 'url(/assets/writing.webp)',
    'url(/assets/oai_arco_thumbnail.jpg)',

  ];
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetchWithAuth(`/api/dashboard/listings/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch listing');
        }

        const data = await response.json();
        setListing(data);
        setDescription(data?.description)
        setPrice(data?.price.toString())
        setListingId(data?.id.toString())
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [id, fetchWithAuth]);

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = useCallback(() => setActiveStep((prevState) => prevState + 1), []);
  const handleBack = useCallback(() => setActiveStep((prevState) => prevState - 1), []);
  const handleComplete = useCallback(async () => {
    try {
      const payload = { listingId, description, price: Number(price) };
      const response = await fetchWithAuth('/api/dashboard/listings/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate(`/dashboard/listings/${listingId}`);
        toast.success('Anunțul a fost modificat cu succes');
      } else {
        console.error('Failed to save listing:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  }, [fetchWithAuth, description, price]);


  const steps = useMemo(() => [
    {
      label: 'Descriere',
      content: (
        <ChooseDescription
          selectedSubject={listing?.subjectId?.toString() || ''}
          description={description}
          setDescription={setDescription}
          onBack={handleBack}
          onNext={handleNext}
          isFirst={true}
        />
      ),
    },
    {
      label: 'Preț',
      content: (
        <ChoosePrice
          selectedSubject={{ id: listing?.subjectId }}
          price={price}
          setPrice={setPrice}
          onBack={handleBack}
          onNext={handleComplete}
        />
      ),
    },
  ], [handleBack, handleNext, handleComplete, description, price]);


  if (isLoading) {
    return (
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Seo title={`Modifică anunț - ${listing?.subject}`}/>

      <Box
        component="main"
        sx={{
          display: 'flex',
          flexGrow: 1,
        }}
      >
        <Grid
          container
          sx={{flexGrow: 1}}
        >
          <Grid
            xs={12}
            sm={4}
            // onClick={handleBackgroundChange}
            sx={{
              backgroundImage: wallpapers[currentWallpaperIndex],
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              display: {
                xs: 'none',
                md: 'block',
              },
              // cursor: 'pointer',
            }}
          />
          <Grid
            xs={12}
            md={8}
            sx={{
              p: {
                xs: 4,
                sm: 6,
                md: 8,
              },
            }}
          >

            <Stack maxWidth="sm"
                   spacing={2}
            >
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.dashboard.personalListingDetails.replace(':id', listing.id)}
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                  }}
                  underline="hover"
                >
                  <SvgIcon sx={{mr: 1}}>
                    <ArrowLeftIcon/>
                  </SvgIcon>
                  <Typography variant="subtitle2">Înapoi</Typography>
                </Link>
              </div>
              <Typography variant="h4" sx={{mt:0}}>
                Modifică anunț • {listing.subject}
              </Typography>
              
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel StepIconComponent={StepIcon}>
                      <Typography variant="overline">{step.label}</Typography>
                    </StepLabel>
                    <StepContent>{step.content}</StepContent>
                  </Step>
                ))}
              </Stepper>

            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default EditPage;
