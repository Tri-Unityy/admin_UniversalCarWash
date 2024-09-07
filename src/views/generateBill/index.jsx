import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Paper, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

// Dummy booking data
const bookings = [
  { id: 1, name: 'John Doe', phoneNumber: '123-456-7890', date: '2024-09-01', timeSlot: '10:00 AM - 11:00 AM', status: 'Confirmed', amount: 150, services: ['Wash', 'Polish'], vehicleType: 'SUV', vehicleNumber: 'ABC123' },
  { id: 2, name: 'Jane Smith', phoneNumber: '987-654-3210', date: '2024-09-02', timeSlot: '12:00 PM - 1:00 PM', status: 'Pending', amount: 200, services: ['Oil Change', 'Tire Rotation'], vehicleType: 'Sedan', vehicleNumber: 'XYZ789' },
  { id: 3, name: 'Alice Johnson', phoneNumber: '555-555-5555', date: '2024-09-03', timeSlot: '2:00 PM - 3:00 PM', status: 'Cancelled', amount: 0, services: [], vehicleType: 'Hatchback', vehicleNumber: 'LMN456' },
  { id: 4, name: 'Bob Brown', phoneNumber: '444-444-4444', date: '2024-09-04', timeSlot: '4:00 PM - 5:00 PM', status: 'Confirmed', amount: 300, services: ['Full Service', 'Wash'], vehicleType: 'SUV', vehicleNumber: 'QWE987' },
  { id: 5, name: 'Charlie Davis', phoneNumber: '333-333-3333', date: '2024-09-05', timeSlot: '9:00 AM - 10:00 AM', status: 'Pending', amount: 120, services: ['Polish'], vehicleType: 'Truck', vehicleNumber: 'GHI321' },
  { id: 6, name: 'Emily Evans', phoneNumber: '222-222-2222', date: '2024-09-06', timeSlot: '3:00 PM - 4:00 PM', status: 'Cancelled', amount: 0, services: [], vehicleType: 'Sedan', vehicleNumber: 'JKL654' }
];

const GenerateBill = () => {
  const { id } = useParams(); // Get booking ID from the URL
  const navigate = useNavigate();

  // Find booking data by ID
  const booking = bookings.find((b) => b.id === parseInt(id));

  // State to manage editable form fields
  const [formData, setFormData] = useState({
    name: booking?.name || '',
    phoneNumber: booking?.phoneNumber || '',
    date: booking?.date || '',
    timeSlot: booking?.timeSlot || '',
    vehicleType: booking?.vehicleType || '',
    vehicleNumber: booking?.vehicleNumber || '',
    amount: booking?.amount || 0,
    discount: 0, // New field for discount
    services: booking?.services.join(', ') || '' // New field for services
  });

  if (!booking) {
    return <Typography variant="h5">Booking not found</Typography>;
  }

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleGenerateBill = () => {
    navigate('/generatedBill');
  };

  return (
    <MainCard title={`Generate Bill for Booking ID: ${booking.id}`}>
      <Paper sx={{ padding: 3 }}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Customer Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Booking Date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Booking Time Slot"
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Vehicle Type"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Vehicle Number"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Discount"
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Services"
            name="services"
            value={formData.services}
            onChange={handleChange}
            helperText="Separate services with commas"
          />
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
            onClick={() => navigate(`/bookingDetails/${id}`)}
          >
            Back to Booking Details
          </Button>
        </Box>
      </Paper>
    </MainCard>
  );
};

export default GenerateBill;
