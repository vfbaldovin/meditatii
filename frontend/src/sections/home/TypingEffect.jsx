// TypingEffect.js
import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';

const TypingEffect = ({ subjectNames }) => {
  const [subject, setSubject] = useState('');
  let currentSubjectIndex = 0;
  let currentCharacterIndex = 0;
  let direction = 'forward';
  let isMounted = true;

  const cursorStyle = {
    display: 'inline-block',
    marginLeft: '2px',
    backgroundColor: 'currentColor',
    width: '3px',
    height: '1em',
    animation: 'blink 1s step-start 0s infinite',
  };

  useEffect(() => {
    const updateSubject = () => {
      setTimeout(() => {
        if (!isMounted) return;

        if (direction === 'forward') {
          currentCharacterIndex++;
          if (currentCharacterIndex > subjectNames[currentSubjectIndex].length) {
            direction = 'backward';
            setTimeout(updateSubject, 2000); // Wait before deleting
            return;
          }
        } else {
          currentCharacterIndex--;
          if (currentCharacterIndex === 0) {
            direction = 'forward';
            currentSubjectIndex = (currentSubjectIndex + 1) % subjectNames.length;
          }
        }

        setSubject(subjectNames[currentSubjectIndex].slice(0, currentCharacterIndex));
        updateSubject();
      }, direction === 'forward' ? 100 : 50); // Typing speed and deleting speed
    };

    updateSubject();

    return () => {
      isMounted = false;
    };
  }, [subjectNames]);

  return (
    <Typography
      color="primary.main"
      variant="h2"
      sx={{ mb: 3, textAlign: 'center'}}
    >
      {subject}
      <span style={cursorStyle} />
    </Typography>
  );
};

export default TypingEffect;
