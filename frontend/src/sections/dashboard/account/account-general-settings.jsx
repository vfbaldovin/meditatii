import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import {alpha} from '@mui/system/colorManipulator';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";

const STORAGE_KEY = 'accessToken';

export const AccountGeneralSettings = (props) => {
  const { avatar, email, name } = props;

  const [selectedFile, setSelectedFile] = useState(null);
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

    // **Validate file type first**
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

    // **Compress the image regardless of its size**
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

      setSelectedFile(null);
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
    <Stack spacing={4} {...props}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Typography variant="h6">Basic Details</Typography>
            </Grid>
            <Grid xs={12} md={8}>
              <Stack spacing={3}>
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Box
                    sx={{
                      borderColor: 'neutral.300',
                      borderRadius: '50%',
                      borderStyle: 'dashed',
                      borderWidth: 1,
                      p: '4px',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onClick={handleAvatarClick}
                  >
                    <Box
                      sx={{
                        borderRadius: '50%',
                        height: '100%',
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          alignItems: 'center',
                          backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                          borderRadius: '50%',
                          color: 'common.white',
                          display: 'flex',
                          height: '100%',
                          justifyContent: 'center',
                          left: 0,
                          opacity: 0,
                          position: 'absolute',
                          top: 0,
                          width: '100%',
                          zIndex: 1,
                          '&:hover': {
                            opacity: 1,
                          },
                        }}
                      >
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <SvgIcon color="inherit">
                            <Camera01Icon />
                          </SvgIcon>
                          <Typography
                            color="inherit"
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            Select
                          </Typography>
                        </Stack>
                      </Box>
                      <Avatar
                        src={preview}
                        sx={{
                          height: 100,
                          width: 100,
                        }}
                      >
                        <SvgIcon>
                          <User01Icon />
                        </SvgIcon>
                      </Avatar>
                    </Box>

                    {loading && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 2,
                        }}
                      >
                        <CircularProgress size={50} thickness={5} style={{ opacity: 0.9 }} />
                      </Box>
                    )}
                  </Box>

                  <input
                    ref={fileInputRef}
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic"
                    hidden
                    onChange={handleFileChange}
                  />
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleAvatarClick}
                  >
                    Change profile picture
                  </Button>
                </Stack>

                {errorMessage && (
                  <Typography color="error" variant="body2">
                    {errorMessage}
                  </Typography>
                )}

              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">Public profile</Typography>
            </Grid>
            <Grid
              xs={12}
              sm={12}
              md={8}
            >
              <Stack
                divider={<Divider />}
                spacing={3}
              >
                <Stack
                  alignItems="flex-start"
                  direction="row"
                  justifyContent="space-between"
                  spacing={3}
                >
                  <Stack spacing={1}>
                    <Typography variant="subtitle1">Make Contact Info Public</Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      Means that anyone viewing your profile will be able to see your contacts
                      details.
                    </Typography>
                  </Stack>
                  <Switch />
                </Stack>
                <Stack
                  alignItems="flex-start"
                  direction="row"
                  justifyContent="space-between"
                  spacing={3}
                >
                  <Stack spacing={1}>
                    <Typography variant="subtitle1">Available to hire</Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      Toggling this will let your teammates know that you are available for
                      acquiring new projects.
                    </Typography>
                  </Stack>
                  <Switch defaultChecked />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">Delete Account</Typography>
            </Grid>
            <Grid
              xs={12}
              md={8}
            >
              <Stack
                alignItems="flex-start"
                spacing={3}
              >
                <Typography variant="subtitle1">
                  Delete your account and all of your source data. This is irreversible.
                </Typography>
                <Button
                  color="error"
                  variant="outlined"
                >
                  Delete account
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

    </Stack>
  );
};

AccountGeneralSettings.propTypes = {
  avatar: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
