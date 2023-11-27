import {formatDistanceToNowStrict, parseISO, subHours, subMinutes} from 'date-fns';
import numeral from 'numeral';
import HeartIcon from '@untitled-ui/icons-react/build/esm/Heart';
import Users01Icon from '@untitled-ui/icons-react/build/esm/Users01';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const now = new Date();

const project = [
  {
    id: '5e8dcef8f95685ce21f16f3d',
    author: {
      id: '5e887b7602bdbc4dbb234b27',
      avatar: '/assets/avatars/avatar-jie-yan-song.png',
      name: 'Jie Yan Song',
    },
    budget: 6125.0,
    caption:
      "We're looking for experienced Developers and Product Designers to come aboard and help us build succesful businesses through software.",
    currency: '$',
    isLiked: true,
    likes: 7,
    location: 'Europe',
    image: '/assets/covers/abstract-2-4x4-small.png',
    rating: 5,
    membersCount: 2,
    title: 'Mella Full Screen Slider',
    type: 'Full-Time',
    updatedAt: subMinutes(now, 24).getTime(),
  }]

export const GridList2 = ({ projects }) => (
  <Box
    sx={{
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50'),
      p: 3,
    }}
  >
    <Grid
      container
      spacing={3}
    >
      {projects.map((project) => {
        const updatedAgo = formatDistanceToNowStrict(parseISO(project.createdDate), { addSuffix: true });        const budget = numeral(project.budget).format(`${project.currency}0,0.00`);

        return (
          <Grid
            key={project.id}
            xs={12}
            md={4}
            sx={{
              boxShadow: 'unset'
            }}
          >
            <Card
              sx={{
                boxShadow: 'unset'
            }}
            >
              <Box sx={{ p: 2, boxShadow: 'unset' }}>

                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    mt: 2,
                    boxShadow: 'unset'
                  }}
                >
                  <Avatar src={project.tutorImage} />
                  <Box sx={{ ml: 2, boxShadow: 'unset' }}>
                    <Link
                      color="text.primary"
                      variant="h6"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {project.title}
                    </Link>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      by{' '}
                      <Link
                        color="text.primary"
                        variant="subtitle2"
                      >
                        {project.tutorName}
                      </Link>{' '}
                      | Updated {updatedAgo} ago
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  pb: 2,
                  px: 3,
                  maxHeight: '10rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  {project.description}
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
                    <Typography variant="subtitle2">{project.price} lei / oră</Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2">{project.location}</Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      Location
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2">{project.type}</Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      Type
                    </Typography>
                  </div>
                </Stack>
              </Box>
              <Divider />
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  pl: 2,
                  pr: 3,
                  py: 2,
                }}
              >
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <Tooltip title="Unlike">
                    <IconButton>
                      <SvgIcon
                        sx={{
                          color: 'error.main',
                          '& path': {
                            fill: (theme) => theme.palette.error.main,
                            fillOpacity: 1,
                          },
                        }}
                      >
                        <HeartIcon />
                      </SvgIcon>
                    </IconButton>
                  </Tooltip>
                  <Typography
                    color="text.secondary"
                    variant="subtitle2"
                  >
                    {project.likes}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    ml: 2,
                  }}
                >
                  <SvgIcon>
                    <Users01Icon />
                  </SvgIcon>
                  <Typography
                    color="text.secondary"
                    sx={{ ml: 1 }}
                    variant="subtitle2"
                  >
                    {project.membersCount}
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Rating
                  readOnly
                  size="small"
                  value={project.rating}
                />
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  </Box>
);
