import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Bookings = () => {
  const navigate = useNavigate();

  // Dummy columns data
  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'date', label: 'Booking Date' },
    { id: 'status', label: 'Status' },
    { id: 'manage', label: 'Manage' }, // New column for "Manage" button
  ];

  // Dummy rows data
  const rows = [
    { id: 1, name: 'John Doe', date: '2024-09-01', status: 'Confirmed' },
    { id: 2, name: 'Jane Smith', date: '2024-09-02', status: 'Pending' },
    { id: 3, name: 'Alice Johnson', date: '2024-09-03', status: 'Cancelled' },
    { id: 4, name: 'Bob Brown', date: '2024-09-04', status: 'Confirmed' },
    { id: 5, name: 'Charlie Davis', date: '2024-09-05', status: 'Pending' },
    { id: 6, name: 'Emily Evans', date: '2024-09-06', status: 'Cancelled' },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Function to handle Manage button click
  const handleManageClick = (id) => {
    navigate(`/bookingDetails/${id}`);
  };

  return (
    <MainCard title="Bookings">
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id}>
                  {columns.slice(0, -1).map((column) => ( // Skip the last column for "Manage"
                    <TableCell key={column.id}>{row[column.id]}</TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleManageClick(row.id)}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </MainCard>
  );
};

export default Bookings;
