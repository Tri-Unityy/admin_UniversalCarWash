import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Typography,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/firebase.config';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // Fetch bills from Firebase
  const fetchBills = async () => {
    try {
      const billsCollection = collection(db, 'bills');
      const billsSnapshot = await getDocs(billsCollection);
      const billsList = billsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setBills(billsList);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewBill = (bill) => {
    navigate('/bill-view', { state: bill });
  };

  const handleDeleteBill = async (id) => {
    try {
      await deleteDoc(doc(db, 'bills', id));
      // Refresh the bills list
      fetchBills();
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  return (
    <MainCard title="Bills List">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="bills table">
          <TableHead>
            <TableRow>
              <TableCell>Bill ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box display="flex" justifyContent="center" p={2}>
                    <Typography variant="body1">No bills found</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              bills.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>{bill.bookingId || bill.id}</TableCell>
                  <TableCell>{bill.customerName}</TableCell>
                  <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                  <TableCell>₹{bill.totalAmount}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleViewBill(bill)} title="View Bill">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteBill(bill.id)} title="Delete Bill">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={bills.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </MainCard>
  );
};

export default Bills;
