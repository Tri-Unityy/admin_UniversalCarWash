import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Button,
    Select,
    MenuItem
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore/lite';
import { db } from './../../utils/firebase.config';

const Bookings = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const columns = [
        { id: 'name', label: 'Name' },
        { id: 'email', label: 'Email' },
        { id: 'phone', label: 'Phone' },
        { id: 'date', label: 'Booking Date' },
        { id: 'status', label: 'Status' },
        { id: 'manage', label: 'Manage' },
        { id: 'delete', label: 'Delete' }
    ];

    useEffect(() => {
        const fetchBookings = async () => {
            const bookingsRef = collection(db, 'universal-carwash-booking');
            const querySnapshot = await getDocs(bookingsRef);
            const bookings = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setRows(bookings);
        };

        fetchBookings();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleManageClick = (id) => {
        navigate(`/bookingDetails/${id}`);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const bookingRef = doc(db, 'universal-carwash-booking', id);
            await updateDoc(bookingRef, { status: newStatus });

            // Update the state to reflect the new status
            setRows((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, status: newStatus } : row)));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDeleteBooking = async (id) => {
        try {
            const bookingRef = doc(db, 'universal-carwash-booking', id);
            await deleteDoc(bookingRef);

            // Remove the deleted booking from the state
            setRows((prevRows) => prevRows.filter((row) => row.id !== id));
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
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
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.phone}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>
                                        <Select value={row.status} onChange={(e) => handleStatusChange(row.id, e.target.value)}>
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Confirmed">Confirmed</MenuItem>
                                            <MenuItem value="Finished">Finished</MenuItem>
                                            <MenuItem value="Finished">Finished & Delivered</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleManageClick(row.id)}>
                                            Manage
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="error" onClick={() => handleDeleteBooking(row.id)}>
                                            Delete
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
