import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';

export const CourseSearch = () => {
  return (
    <Card sx={{ borderRadius: '7px', width: '100%', maxWidth: '50rem'}}>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={0}
        sx={{ p: 0 }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            defaultValue=""
            fullWidth
            placeholder="Ce ți-ar plăcea să înveți?"
            name="query"
            variant="outlined"
            InputProps={{
              style: { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
            }}
          />
        </Box>

        <Button
          size="large"
          startIcon={
            <SvgIcon>
              <SearchMdIcon />
            </SvgIcon>
          }
          variant="contained"
          sx={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: '5px',
            borderBottomRightRadius: '5px',
            boxShadow: 'none',
            height: '100%',
            lineHeight: '31px',
          }}
        >
          Caută
        </Button>
      </Stack>
    </Card>
  );
};
