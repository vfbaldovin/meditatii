import React from 'react';
import Assistant from '@mui/icons-material/Assistant';
import {styled} from "@mui/material/styles";
import {AutoAwesome} from "@mui/icons-material";

// Define the keyframes for color animation with darkening and light effects
const AnimatedIcon = styled(AutoAwesome)({
  position: 'relative',
  '& path': {
    // Apply a gradient to the icon's path using fill with an ID reference
    fill: 'url(#gradient1)',
  },
  // Add a more noticeable reflection effect using a pseudo-element
/*  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '300%',
    height: '300%',
    background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0))',
    opacity: 0.9,
    transform: 'rotate(-45deg)',
    animation: 'lightReflection 4s linear infinite',
  },
  '@keyframes lightReflection': {
    '0%': {
      transform: 'translateX(-150%) translateY(-150%) rotate(-45deg)',
    },
    '100%': {
      transform: 'translateX(150%) translateY(150%) rotate(-45deg)',
    },
  },*/
});

const AnimatedAssistantIcon = ({ fontSize = 'large' }) => {
  return <AnimatedIcon fontSize={fontSize} />;
};

export default AnimatedAssistantIcon;
