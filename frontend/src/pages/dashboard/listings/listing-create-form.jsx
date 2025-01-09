import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';

import { ChooseSubject } from './steps/choose-subject';
import { ChoosePrice } from './steps/choose-price';
import { ChooseDescription } from './steps/choose-description';
import { useAuth } from '../../../hooks/use-auth';
import Avatar from "@mui/material/Avatar";
import SvgIcon from "@mui/material/SvgIcon";
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";
import confetti from "canvas-confetti";
import {useNavigate} from "react-router-dom";

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

export const ListingCreateForm = ({ onSubjectSelect }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [listingId, setListingId] = useState(null);
  const navigate = useNavigate(); // Access navigate here once

  const { fetchWithAuth } = useAuth();

  const handleNext = useCallback(() => setActiveStep((prevState) => prevState + 1), []);
  const handleBack = useCallback(() => setActiveStep((prevState) => prevState - 1), []);

  const handleComplete = useCallback(async () => {
    try {
      const payload = { subjectId: selectedSubject?.id, description, price };

      const response = await fetchWithAuth('/api/dashboard/listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Listing created successfully:', data);
        setListingId(data.id); // Only store listing ID
        setIsComplete(true);
        confetti({
          particleCount: 400,   // Increase number of pieces
          spread: 120,          // Wider area
          startVelocity: 80,    // Faster initial speed
          scalar: 1.5,          // Larger confetti size
          origin: { x: 1, y: 0.5 } // Center of screen
        });
        confetti({
          particleCount: 400,   // Increase number of pieces
          spread:120,          // Wider area
          startVelocity: 80,    // Faster initial speed
          scalar: 1.5,          // Larger confetti size
          origin: { x: 0, y: 0.5 } // Center of screen
        });
        navigate(`/dashboard/listings/${data.id}?s=new`);

      } else {
        console.error('Failed to create listing:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  }, [fetchWithAuth, selectedSubject, description, price]);

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    onSubjectSelect(subject);
  };

  const steps = useMemo(() => [
    {
      label: 'Materie',
      content: (
        <ChooseSubject
          selectedSubject={selectedSubject}
          onBack={handleBack}
          onNext={handleNext}
          onSubjectSelect={handleSubjectSelect}
        />
      ),
    },
    {
      label: 'Descriere',
      content: (
        <ChooseDescription
          selectedSubject={selectedSubject}
          description={description}
          setDescription={setDescription}
          onBack={handleBack}
          onNext={handleNext}
        />
      ),
    },
    {
      label: 'Preț',
      content: (
        <ChoosePrice
          selectedSubject={selectedSubject}
          price={price}
          setPrice={setPrice}
          onBack={handleBack}
          onNext={handleComplete}
        />
      ),
    },
  ], [handleBack, handleNext, handleComplete, selectedSubject, description, price]);


  return (
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
  );
};
