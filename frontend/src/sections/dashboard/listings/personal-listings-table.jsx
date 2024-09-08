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
                  <TableCell sx={{ textAlign: 'center' }}>{listing.promovare ? "Yes" : "No"}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>

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
