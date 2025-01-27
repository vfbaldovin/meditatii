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
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";
import React from "react";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import {useNavigate} from "react-router-dom";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ClearIcon from '@mui/icons-material/Clear';
export const PersonalListingsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 5,  // Default to 5 instead of 0 to avoid warning
    isPromoted = false, // Add `isPromoted` with a default value
  } = props;
  const navigate = useNavigate();

  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ backgroundColor: 'transparent !important' }}>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'transparent !important' }}>Materie</TableCell>
              <TableCell sx={{ textAlign: 'center', backgroundColor: 'transparent !important' }}>Vizualizari</TableCell>
              {/*<TableCell sx={{ textAlign: 'center', backgroundColor: 'transparent !important' }}>Accesări telefon</TableCell>*/}
              <TableCell sx={{ textAlign: 'center', backgroundColor: 'transparent !important' }}>Promovat</TableCell>
              <TableCell sx={{ textAlign: 'center', backgroundColor: 'transparent !important' }}>Actualizare</TableCell>
              {/*<TableCell sx={{ textAlign: 'center', backgroundColor: 'transparent !important' }}>Modifica</TableCell>*/}
              {/*<TableCell sx={{ textAlign: 'center', backgroundColor: 'transparent !important' }} align="right">Detalii</TableCell>*/}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((listing) => {
              const totalViews = numeral(listing.totalViews).format('0,0');

              return (
                <TableRow
                  hover
                  key={listing.id}
                  style={{ cursor: 'pointer' }}

                  onClick={() => navigate(paths.dashboard.personalListingDetails.replace(':id', listing.id))}
                >
                  <TableCell >
                    {listing.subject}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{listing.views}</TableCell>
                  {/*<TableCell sx={{ textAlign: 'center' }}>{listing.views}</TableCell>*/}
                  <TableCell sx={{ textAlign: 'center' }}>

                    {/*<ClearIcon color='error'/>*/}
                    {isPromoted ? (
                      <SeverityPill color="success">DA</SeverityPill>
                    ) : (
                      <SeverityPill color="error">NU</SeverityPill>
                    )}
                    {/*<SeverityPill color='warning'>?</SeverityPill>*/}
                    {/*<WorkspacePremiumIcon*/}
                    {/*  sx={{*/}
                    {/*    color: '#FFC107',*/}
                    {/*    width: '2rem',*/}
                    {/*    height: '2rem',*/}
                    {/*  }}*/}
                    {/*/>*/}

                    {/*<Avatar*/}
                    {/*  sx={{*/}
                    {/*    backgroundColor: 'success.main',*/}
                    {/*    color: 'success.contrastText',*/}
                    {/*    height: 40,*/}
                    {/*    width: 40,*/}
                    {/*  }}*/}
                    {/*>*/}
                    {/*  <SvgIcon>*/}
                    {/*    <CheckIcon />*/}
                    {/*  </SvgIcon>*/}
                    {/*</Avatar>*/}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {/*<Button*/}
                    {/*  // startIcon={*/}
                    {/*  //*/}
                    {/*  // }*/}
                    {/*  variant="contained"*/}
                    {/*>*/}
                    {/*  <SvgIcon>*/}
                    {/*    <RefreshCcw01Icon />*/}
                    {/*  </SvgIcon>*/}
                    {/*  /!*Sync Data*!/*/}
                    {/*</Button>*/}
                    <IconButton>
                      <SvgIcon fontSize="small">
                        <RefreshCcw01Icon />
                      </SvgIcon>
                    </IconButton>
                  </TableCell>

                  {/*<TableCell sx={{ textAlign: 'center' }}>*/}
                  {/*  <IconButton*/}
                  {/*    component={RouterLink}*/}
                  {/*    href={paths.dashboard.personalListingsEdit}*/}
                  {/*  >*/}
                  {/*    <SvgIcon>*/}
                  {/*      <Edit02Icon />*/}
                  {/*    </SvgIcon>*/}
                  {/*  </IconButton>*/}
                  {/*</TableCell>*/}

                  {/*<TableCell sx={{ textAlign: 'center' }} align="right">*/}
                  {/*  <IconButton*/}
                  {/*    component={RouterLink}*/}
                  {/*    href={paths.dashboard.personalListingDetails.replace(':id', listing.id)}*/}
                  {/*  >*/}
                  {/*    <SvgIcon>*/}
                  {/*      <ArrowRightIcon />*/}
                  {/*    </SvgIcon>*/}
                  {/*  </IconButton>*/}
                  {/*</TableCell>*/}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      {count > 5 && ( // Only show pagination if count is greater than 5
        <TablePagination
          component="div"
          count={count}
          page={page}
          rowsPerPage={5} // Hardcoded to 5
          onPageChange={onPageChange}
          labelDisplayedRows={({ page }) => `Pagina ${page + 1} din ${Math.ceil(count / 5)}`} // Custom text
          rowsPerPageOptions={[]} // Disable rows per page dropdown
        />
      )}

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
