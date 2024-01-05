import {formatDistanceToNowStrict, parseISO} from 'date-fns';
import numeral from 'numeral';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useNavigate} from "react-router";
import { useDispatch } from 'react-redux';
import {setCurrentPage} from "../../../slices/home";
export const GridList2 = ({projects}) => {

  const PromotedChip = () => {
    return (

      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          color: 'white',
          fontWeight: 'bold',
          backgroundColor: 'primary.main',
          borderRadius: '50%', // Make the box circular
          width: '2rem',      // Set a specific width
          height: '2rem',     // Set a specific height to match the width
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Nice, subtle boxShadow
          opacity: 0.9,
        }}
      >
        <svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
             viewBox="0 0 47.94 47.94" xmlSpace="preserve">
        <path fill="white" d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
          c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
          c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
          c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
          c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
          C22.602,0.567,25.338,0.567,26.285,2.486z"/>
        </svg>
      </Box>
    );
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCardClick = (id) => {
    navigate(`/announcement/${id}`);
  };
  return (
    <Box
      sx={{
        // backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50'),
        p: 3,
      }}
    >
      <Grid
        container
        spacing={3}
      >
        {projects.map((announcement) => {
          const updatedAgo = formatDistanceToNowStrict(parseISO(announcement.createdDate), {addSuffix: true});

          return (
            <Grid
              key={announcement.id}
              xs={12}
              md={12}
            >
              <Card
                onClick={() => handleCardClick(announcement.id)}
                sx={{
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  position: 'relative',

                  border:  (theme) => (theme.palette.mode === 'light' ? '1px solid whitesmoke' : '1px solid rgb(47, 79, 79)'),
                  '&:hover': {
                    border: (theme) => (theme.palette.mode === 'light' ? '1px solid #6C737F' : '1px solid whitesmoke'),
                    borderRadius: '20px',
                  },
                }}
              >
                {announcement.promoted && <PromotedChip />}
                <Box sx={{p: 2, boxShadow: 'unset', padding: '8px 16px 16px'}}>

                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      mt: 2
                    }}
                  >
                    <Avatar src={announcement.tutorImage}/>
                    <Box sx={{ml: 2, boxShadow: 'unset'}}>
                      <Link
                        color="text.primary"
                        variant="h6"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {announcement.title}
                      </Link>
                      <Typography color="text.secondary" variant="body2">
                        de{' '}
                        <Typography component="span" color="text.primary" variant="subtitle2">
                          {announcement.tutorName}
                        </Typography>
                        {' '}| Actualizat acum {updatedAgo.replace('days ago','zile')}
                      </Typography>

                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    pb: 2,
                    px: 3,
                    maxHeight: '4rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    {announcement.description}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    px: 3,
                    py: 2,
                  }}
                >
                  <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                  >
                    <div>
                      <Typography color="primary.main" variant="subtitle2">{announcement.price} lei
                        / oră</Typography>
                    </div>
                    <div>

                      <Typography color="primary.main"
                                  variant="subtitle2">{announcement.subject}</Typography>
                    </div>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  )
}
