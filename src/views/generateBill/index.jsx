import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Paper, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

const GenerateBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state;
  const currentDate = new Date().toISOString().split('T')[0];

  const calculateSubTotal = (services) =>
    services.reduce((sum, service) => sum + (service.price || 0), 0);

  const [formData, setFormData] = useState({
    name: booking?.name || '',
    phoneNumber: booking?.phoneNumber || '',
    bookingdate: booking?.date || '',
    timeSlot: booking?.timeSlot || '',
    vehicleType: booking?.vehicleType || '',
    vehicleNumber: booking?.vehicleNumber || '',
    discount: 0,
    services: booking?.services.map((service) => ({ name: service, price: 0 })) || [],
    paymentDueDate: currentDate,
    serviceDate: currentDate,
    customerAddress: booking?.customerAddress || '',
    subTotal: 0,
    total: 0,
  });

  // Calculate subtotal and total whenever services or discount change
  useEffect(() => {
    const subTotal = calculateSubTotal(formData.services);
    const total = subTotal - formData.discount;
    setFormData((prevData) => ({ ...prevData, subTotal, total }));
  }, [formData.services, formData.discount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddService = () => {
    setFormData((prevData) => ({
      ...prevData,
      services: [...prevData.services, { name: '', price: 0 }],
    }));
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = field === 'price' ? parseFloat(value) || 0 : value;
    setFormData((prevData) => ({ ...prevData, services: updatedServices }));
  };

  const handleRemoveService = (index) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, services: updatedServices }));
  };

  const handleGenerateBill = () => {
    console.log('Generated Bill Data:', formData);
    navigate('/generatedBill', { state: formData });
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
            onChange={handleInputChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Customer Address"
            name="customerAddress"
            value={formData.customerAddress}
            onChange={handleInputChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Booking Date"
            name="bookingdate"
            value={formData.bookingdate}
            onChange={handleInputChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Booking Time Slot"
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleInputChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Vehicle Type"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleInputChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Vehicle Number"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleInputChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Discount"
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleInputChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Payment Due Date"
            name="paymentDueDate"
            type="date"
            value={formData.paymentDueDate}
            onChange={handleInputChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Service Date"
            name="serviceDate"
            type="date"
            value={formData.serviceDate}
            onChange={handleInputChange}
          />
        </Box>

        <Typography variant="h6" gutterBottom>
          Services
        </Typography>
        {formData.services.map((service, index) => (
          <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
            <TextField
              label="Service Name"
              value={service.name}
              onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
              fullWidth
            />
          <TextField
            label="Price"
            type="number"
            value={service.price || ""}
            onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
            sx={{ width: 120 }}
          />
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemoveService(index)}
            >
              Remove
            </Button>
          </Box>
        ))}
        <Button variant="outlined" onClick={handleAddService} sx={{ mb: 2 }}>
          Add Service
        </Button>

        <Box mb={2}>
          <Typography variant="subtitle1">Subtotal: {formData.subTotal}</Typography>
          <Typography variant="subtitle1">Total: {formData.total}</Typography>
        </Box>

        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateBill}
            sx={{ marginRight: 2 }}
            disabled={formData.services.some((service) => !service.price)}
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
