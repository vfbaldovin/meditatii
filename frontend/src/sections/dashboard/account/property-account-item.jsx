import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';

export const PropertyAccountItem = (props) => {
  const { align = 'vertical', children, disableGutters, value, label, icon, noDivider = false, ...other } = props;

  return (
    <ListItem
      sx={{
        px: disableGutters ? 0 : 3,
        py: 1.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderBottom: noDivider ? 'none' : 'none', // Conditional border-bottom
      }}
      {...other}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {icon && (
          <SvgIcon
            color="action"
            fontSize="small"
            sx={{
              display: 'inline',
              verticalAlign: 'middle',
            }}
          >
            {icon}
          </SvgIcon>
        )}
        <Typography
          component="span"
          variant="subtitle2"
          sx={{ display: 'inline', ml: 1 }}
        >
          {label}
        </Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          mt: 0.5,
        }}
      >
        {children || (
          <Typography
            component="span"
            color="text.secondary"
            variant="body2"
          >
            {value}
          </Typography>
        )}
      </Box>
    </ListItem>
  );
};

PropertyAccountItem.propTypes = {
  align: PropTypes.oneOf(['horizontal', 'vertical']),
  children: PropTypes.node,
  disableGutters: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  icon: PropTypes.node,
};
