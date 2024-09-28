import numeral from 'numeral';
import PropTypes from 'prop-types';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { RouterLink } from 'src/components/router-link';
import { Scrollbar } from 'src/components/scrollbar';
import { paths } from 'src/paths';
import RefreshCcw01Icon from "@untitled-ui/icons-react/build/esm/RefreshCcw01";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import {alpha} from "@mui/system/colorManipulator";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import ArrowsUp from "@untitled-ui/icons-react/build/esm/ArrowsUp";
import Button from "@mui/material/Button";
import {SeverityPill} from "../../../components/severity-pill";

export const PersonalListingsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 5,  // Default to 5 instead of 0 to avoid warning
  } = props;

  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ backgroundColor: 'transparent !important' }}>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'transparent !important' }}>Materie</TableCell>
              <TableCell sx={{ textAlign: 'center', backgroundColor: 'transparent !important' }}>Vizualizari</TableCell>
              <TableCell sx={{ textAlign: 'center', backgroundColor: 'transparent !important' }}>Promovare</TableCell>
              <TableCell sx={{ textAlign: 'center', backgroundColor: 'transparent !important' }}>Actualizare</TableCell>
              <TableCell sx={{ textAlign: 'center', backgroundColor: 'transparent !important' }} align="right">Modifica</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((listing) => {
              const totalViews = numeral(listing.totalViews).format('0,0');

              return (
                <TableRow
                  hover
                  key={listing.id}
                >
                  <TableCell >
                    {listing.subject}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{listing.views}</TableCell>
                  <TableCell sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar sx={{ backgroundColor: 'transparent' }}>
                      <Box
                        sx={{
                          animation: 'pulse ease 750ms infinite',
                          borderRadius: '50%',
                          p: 0.5,
                          '@keyframes pulse': {
                            '0%': {
                              boxShadow: 'none',
                            },
                            '100%': {
                              boxShadow: (theme) => `0px 0px 0px 6px ${alpha(theme.palette.success.main, 0.1)}`,
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: 'success.main',
                            borderRadius: '50%',
                            height: 18,
                            width: 18,
                          }}
                        />
                      </Box>
                    </Avatar>
                    <IconButton
                      component={RouterLink}
                      href={paths.dashboard.personalListingsEdit}
                    >
                      <SvgIcon>
                        <ArrowsUp />
                      </SvgIcon>
                    </IconButton>
                    <SeverityPill color='success'>DA</SeverityPill>
                    <SeverityPill color='warning'>?</SeverityPill>
                    <SeverityPill color='error'>NU</SeverityPill>

                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      // startIcon={
                      //
                      // }
                      variant="contained"
                    >
                      <SvgIcon>
                        <RefreshCcw01Icon />
                      </SvgIcon>
                      {/*Sync Data*/}
                    </Button>
                    <IconButton>
                      <SvgIcon fontSize="small">
                        <RefreshCcw01Icon />
                      </SvgIcon>
                    </IconButton>
                  </TableCell>

                  <TableCell sx={{ textAlign: 'center' }} align="right">
                    <IconButton
                      component={RouterLink}
                      href={paths.dashboard.personalListingsEdit}
                    >
                      <SvgIcon>
                        <Edit02Icon />
                      </SvgIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

PersonalListingsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
