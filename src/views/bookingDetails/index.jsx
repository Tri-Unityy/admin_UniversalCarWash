import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Paper, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';


const bookings = [
  { id: 1, name: 'John Doe', phoneNumber: '123-456-7890', date: '2024-09-01', timeSlot: '10:00 AM - 11:00 AM', status: 'Confirmed', amount: 150, services: ['Wash', 'Polish'], vehicleType: 'SUV', vehicleNumber: 'ABC123' },
  { id: 2, name: 'Jane Smith', phoneNumber: '987-654-3210', date: '2024-09-02', timeSlot: '12:00 PM - 1:00 PM', status: 'Pending', amount: 200, services: ['Oil Change', 'Tire Rotation'], vehicleType: 'Sedan', vehicleNumber: 'XYZ789' },
  { id: 3, name: 'Alice Johnson', phoneNumber: '555-555-5555', date: '2024-09-03', timeSlot: '2:00 PM - 3:00 PM', status: 'Cancelled', amount: 0, services: [], vehicleType: 'Hatchback', vehicleNumber: 'LMN456' },
  { id: 4, name: 'Bob Brown', phoneNumber: '444-444-4444', date: '2024-09-04', timeSlot: '4:00 PM - 5:00 PM', status: 'Confirmed', amount: 300, services: ['Full Service', 'Wash'], vehicleType: 'SUV', vehicleNumber: 'QWE987' },
  { id: 5, name: 'Charlie Davis', phoneNumber: '333-333-3333', date: '2024-09-05', timeSlot: '9:00 AM - 10:00 AM', status: 'Pending', amount: 120, services: ['Polish'], vehicleType: 'Truck', vehicleNumber: 'GHI321' },
  { id: 6, name: 'Emily Evans', phoneNumber: '222-222-2222', date: '2024-09-06', timeSlot: '3:00 PM - 4:00 PM', status: 'Cancelled', amount: 0, services: [], vehicleType: 'Sedan', vehicleNumber: 'JKL654' }
];

const BookingDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();


  const booking = bookings.find((b) => b.id === parseInt(id));

  if (!booking) {
    return <Typography variant="h5">Booking not found</Typography>;
  }

  const handleGenerateBill = () => {
    navigate(`/generateBill/${booking.id}`);
  };

  return (
    <MainCard title={`Booking Details for ID: ${booking.id}`}>
      <Paper sx={{ padding: 3 }}>
        <Box mb={2}>
          <Typography variant="h6">Customer Name: {booking.name}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Phone Number: {booking.phoneNumber}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Booking Date: {booking.date}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Booking Time Slot: {booking.timeSlot}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Vehicle Type: {booking.vehicleType}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Vehicle No: {booking.vehicleNumber}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Status: {booking.status}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Services: {booking.services.length ? booking.services.join(', ') : 'None'}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Amount: ${booking.amount}</Typography>
        </Box>

        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateBill}
            sx={{ marginRight: 2 }}
          >
            Generate Bill
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/bookings')}
          >
            Back to Bookings
          </Button>
        </Box>
      </Paper>
    </MainCard>
  );
};

export default BookingDetails;
