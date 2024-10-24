import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import CheckIcon from '@untitled-ui/icons-react/build/esm/Check';
import Avatar from '@mui/material/Avatar';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { ChooseSubject } from './steps/choose-subject';
import { PriceStep } from './steps/price-step';
import { ChooseDescription } from './steps/choose-description';
import { JobPreview } from './steps/job-preview';

const StepIcon = (props) => {
  const { active, completed, icon } = props;

  const highlight = active || completed;

  return (
    <Avatar
      sx={{
        height: 40,
        width: 40,
        ...(highlight && {
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        }),
      }}
      variant="rounded"
    >
      {completed ? (
        <SvgIcon>
          <CheckIcon />
        </SvgIcon>
      ) : (
        icon
      )}
    </Avatar>
  );
};

StepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node.isRequired,
};

export const ListingCreateForm = ({ onSubjectSelect }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null); // Store the selected subject
  const [description, setDescription] = useState(''); // Store the description here

  const handleNext = useCallback(() => {
    setActiveStep((prevState) => prevState + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prevState) => prevState - 1);
  }, []);

  const handleComplete = useCallback(() => {
    setIsComplete(true);
  }, []);

  // Handle subject selection
  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject); // Store the selected subject in state
    onSubjectSelect(subject); // Pass it to the parent for display in the title
  };

  const steps = useMemo(() => {
    return [
      {
        label: 'Materie',
        content: (
          <ChooseSubject
            selectedSubject={selectedSubject} // Pass the selected subject to ChooseSubject
            onBack={handleBack}
            onNext={handleNext}
            onSubjectSelect={handleSubjectSelect} // Pass the subject select handler
          />
        ),
      },
      {
        label: 'Descriere',
        content: (
          <ChooseDescription
            selectedSubject={selectedSubject} // Pass the selected subject to ChooseDescription
            description={description} // Pass description state
            setDescription={setDescription} // Pass setDescription function
            onBack={handleBack}
            onNext={handleNext}
          />
        ),
      },
      {
        label: 'Preț',
        content: (
          <PriceStep
            selectedSubject={selectedSubject} // Pass the selected subject to PriceStep
            onBack={handleBack}
            onNext={handleComplete}
          />
        ),
      },
    ];
  }, [handleBack, handleNext, handleComplete, selectedSubject, description]);

  if (isComplete) {
    return <JobPreview />;
  }

  return (
    <Stepper
      activeStep={activeStep}
      orientation="vertical"
      sx={{
        '& .MuiStepConnector-line': {
          borderLeftColor: 'divider',
          borderLeftWidth: 2,
          ml: 1,
        },
      }}
    >
      {steps.map((step, index) => {
        const isCurrentStep = activeStep === index;

        return (
          <Step key={step.label}>
            <StepLabel StepIconComponent={StepIcon}>
              <Typography
                sx={{ ml: 2 }}
                variant="overline"
              >
                {step.label}
              </Typography>
            </StepLabel>
            <StepContent
              sx={{
                borderLeftColor: 'divider',
                borderLeftWidth: 2,
                ml: '20px',
                ...(isCurrentStep && {
                  py: 4,
                }),
              }}
            >
              {step.content}
            </StepContent>
          </Step>
        );
      })}
    </Stepper>
  );
};
