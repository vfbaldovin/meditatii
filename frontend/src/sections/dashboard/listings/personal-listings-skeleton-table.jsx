import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { Scrollbar } from 'src/components/scrollbar';

export const PersonalListingsSkeletonTable = () => {
  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ backgroundColor: 'transparent !important' }}>
            <TableRow>
              <TableCell></TableCell>
              <TableCell sx={{ textAlign: 'center' }}></TableCell>
              <TableCell sx={{ textAlign: 'center' }}></TableCell>
              <TableCell sx={{ textAlign: 'center' }}></TableCell>
              <TableCell sx={{ textAlign: 'center' }} align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton variant="text" height={30} /></TableCell>
                <TableCell sx={{ textAlign: 'center' }}><Skeleton variant="text" height={30} /></TableCell>
                <TableCell sx={{ textAlign: 'center' }}><Skeleton variant="text" height={30} /></TableCell>
                <TableCell sx={{ textAlign: 'center' }}><Skeleton variant="text" height={30} /></TableCell>
                <TableCell sx={{ textAlign: 'center' }} align="right"><Skeleton variant="text" height={30} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={5}
        page={0}
        rowsPerPage={3}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
    </Box>
  );
};
