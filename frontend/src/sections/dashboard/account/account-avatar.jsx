import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import { alpha } from '@mui/system/colorManipulator';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";

const STORAGE_KEY = 'accessToken';

export const AccountAvatar = ({ avatar }) => {
  const [preview, setPreview] = useState(avatar);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  const maxSize = 5 * 1024 * 1024; // 5MB size limit
  const token = sessionStorage.getItem(STORAGE_KEY);

  useEffect(() => {
    setPreview(`${avatar}?t=${new Date().getTime()}`); // Cache-busting timestamp
  }, [avatar]);

  const handleFileChange = async (event) => {
    let file = event.target.files[0];

    // Reset the error message and loading state
    setErrorMessage('');
    setLoading(false);

    // Return if no file is selected
    if (!file) {
      setErrorMessage('No file selected.');
      return;
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Invalid file type. Only JPEG, PNG, WebP, and HEIC are allowed.');
      return;
    }

    // Set loading to true after validation passes
    setLoading(true);

    // Convert HEIC to JPEG/PNG if necessary
    if (file.type === 'image/heic') {
      try {
        const convertedBlob = await heic2any({ blob: file, toType: 'image/jpeg' });
        file = new File([convertedBlob], file.name.replace(/\..+$/, '.jpeg'), { type: 'image/jpeg' });
      } catch (error) {
        setErrorMessage('Error converting HEIC file. Please try another format.');
        setLoading(false);
        return;
      }
    }

    // Compress the image
    const options = {
      maxSizeMB: 0.2, // Target maximum size in MB (~200KB)
      maxWidthOrHeight: 300, // Max width or height (suitable for avatars)
      useWebWorker: true, // Use multi-threading for faster processing
    };

    try {
      file = await imageCompression(file, options);
    } catch (error) {
      setErrorMessage('Error compressing the image.');
      setLoading(false);
      return;
    }

    // Set preview after compression
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Automatically upload after selecting and compressing the file
    await handleUploadClick(file);
    setLoading(false);
  };

  const handleUploadClick = async (file) => {
    if (!file) {
      setErrorMessage('No file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${apiBaseUrl}/api/dashboard/update-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.updatedAvatarUrl) {
        const updatedUrl = `${response.data.updatedAvatarUrl}?t=${new Date().getTime()}`;
        setPreview(updatedUrl);

        // Emit custom event to notify other components
        const event = new CustomEvent('avatarChanged', { detail: updatedUrl });
        window.dispatchEvent(event);
      } else {
        setErrorMessage('Error uploading avatar. Server did not return an updated URL.');
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(`Error: ${error.response.data.error || error.response.data.message}`);
      } else if (error.request) {
        setErrorMessage('Error connecting to the server. Please check your connection.');
      } else {
        setErrorMessage(`Unknown error: ${error.message}`);
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: 64,
        height: 64,
        borderRadius: '50%',
        border: '1px dashed',
        borderColor: 'neutral.300',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      onClick={handleAvatarClick}
    >
      <Avatar
        src={preview}
        sx={{
          height: 64,
          width: 64,
        }}
      >
        <Camera01Icon />
      </Avatar>

      {/* Hover Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0, // Initially hidden
          transition: 'opacity 0.3s', // Smooth transition
          '&:hover': {
            opacity: 1, // Show on hover
          },
        }}
      >
        <Stack alignItems="center" direction="row" >
          <SvgIcon color="inherit"
                   sx={{
                     color: '#fff', // Icon color
                   }}>
            <Camera01Icon />
          </SvgIcon>
        </Stack>
      </Box>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -45%)',
            zIndex: 2,
          }}
        >
          <CircularProgress size={35} thickness={5} style={{ opacity: 0.9 }} />
        </Box>
      )}
      <input
        ref={fileInputRef}
        id="avatar-upload"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        hidden
        onChange={handleFileChange}
      />
      {errorMessage && errorMessage !== 'No file' && (
        <Typography color="error" variant="body2" sx={{ position: 'absolute', bottom: -20 }}>
          {errorMessage}
        </Typography>
      )}

    </Box>
  );
};

AccountAvatar.propTypes = {
  avatar: PropTypes.string.isRequired,
};
