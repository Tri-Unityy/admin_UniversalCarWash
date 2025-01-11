import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Paper, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';// Ensure imports are correct
import { db } from './../../utils/firebase.config'; // Import your Firebase configuration

const GenerateBillManual = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state || {};
  const currentDate = new Date().toISOString().split('T')[0];

  const calculateSubTotal = (services) => services.reduce((sum, service) => sum + (service.price || 0), 0);
  const generateBookingID = () => {
    const now = new Date();
    
    // Format date and time components
    const year = now.getFullYear(); // e.g., 2025
    const month = String(now.getMonth() + 1).padStart(2, '0'); // e.g., 01 for January
    const day = String(now.getDate()).padStart(2, '0'); // e.g., 11 for the 11th day
    const hours = String(now.getHours()).padStart(2, '0'); // e.g., 13 for 1 PM
    const minutes = String(now.getMinutes()).padStart(2, '0'); // e.g., 05
    const seconds = String(now.getSeconds()).padStart(2, '0'); // e.g., 45
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // e.g., 123

    // Combine to create a unique numeric ID
    const bookingID = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
    return bookingID;
  };

  const [bookingID,setBookingID] = useState(generateBookingID());

  const [formData, setFormData] = useState({
    id:  bookingID,
    name: booking.name || '',
    phoneNumber: booking.phone || '',
    bookingdate: booking.date || '',
    timeSlot: booking.timeslot || '',
    vehicleType: booking.carmodel || '',
    vehicleNumber: booking.carnumber || '',
    discount: 0,
    services: booking.services?.map((service) => ({ name: service.name, price: service.price })) || [],
    paymentDueDate: currentDate,
    serviceDate: currentDate,
    customerAddress: booking.address || '',
    subTotal: booking.total || 0,
    total: booking.total || 0
  });

  useEffect(() => {
    const subTotal = calculateSubTotal(formData.services);
    const total = subTotal - (formData.discount) * subTotal / 100;
    setFormData((prevData) => ({ ...prevData, subTotal, total }));
  }, [formData.services, formData.discount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddService = () => {
    setFormData((prevData) => ({
      ...prevData,
      services: [...prevData.services, { name: '', price: 0 }]
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

  const handleGenerateBillManual = async () => {
    try {
      const db = getFirestore(); // Get Firestore instance
   
  
      // Reference to the document in Firestore
      const bookingDocRef = doc(db, 'universal-carwash-manual-bills', bookingID);
  
      // Check if the document exists
      const bookingDocSnapshot = await getDoc(bookingDocRef);
  
      if (!bookingDocSnapshot.exists()) {
        // If the document does not exist, create a new one
        const saveData = {
          id: bookingID,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          bookingDate: formData.bookingdate,
          timeSlot: formData.timeSlot,
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
          discount: formData.discount,
          services: formData.services,
          paymentDueDate: formData.paymentDueDate,
          serviceDate: formData.serviceDate,
          customerAddress: formData.customerAddress,
          subTotal: formData.subTotal,
          total: formData.total,
        };
  
        // Save the new document in Firestore
        await setDoc(bookingDocRef, saveData);
  
        console.log('New document created in Firestore:', saveData);
      } else {
        console.log('Document already exists in Firestore.');
      }
  
      // Navigate to the generated bill page with the formData
      navigate('/generatedBill', { state: { ...formData, id: bookingID } });
    } catch (error) {
      console.error('Error handling booking ID:', error);
    }
  };
  
  

  return (
    <MainCard title={`Generate Bill: ${bookingID }`}>
      <Paper sx={{ padding: 3 }}>
        <Box mb={2}>
          <TextField fullWidth label="Customer Name" name="name" value={formData.name} onChange={handleInputChange} />
        </Box>
        <Box mb={2}>
          <TextField fullWidth label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
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
          <TextField fullWidth label="Booking Date" name="bookingdate" value={formData.bookingdate} onChange={handleInputChange} />
        </Box>
        <Box mb={2}>
          <TextField fullWidth label="Booking Time Slot" name="timeSlot" value={formData.timeSlot} onChange={handleInputChange} />
        </Box>
        <Box mb={2}>
          <TextField fullWidth label="Vehicle Type" name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} />
        </Box>
        <Box mb={2}>
          <TextField fullWidth label="Vehicle Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} />
        </Box>
        <Box mb={2}>
                 <TextField fullWidth label="Discount" name="discount" type="number" placeholder='Eg : 10 (Enter the percentage of Discount)' value={formData.discount} onChange={handleInputChange} />
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
              value={service.price || ''}
              onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
              sx={{ width: 120 }}
            />
            <Button variant="outlined" color="error" onClick={() => handleRemoveService(index)}>
              Remove
            </Button>
          </Box>
        ))}

        <Button variant="outlined" onClick={handleAddService} sx={{ mb: 2 }}>
          Add Service
        </Button>

        <Box mb={2}>
          <Typography variant="subtitle1">Subtotal: {formData.subTotal.toFixed(2)}</Typography>
          <Typography variant="subtitle1">Total: {formData.total.toFixed(2)}</Typography>
        </Box>

        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateBillManual}
            sx={{ marginRight: 2 }}
            disabled={formData.services.some((service) => !service.price)}
          >
            Generate Bill
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate(`/bookingDetails/${id}`)}>
            Back to Booking Details
          </Button>
        </Box>
      </Paper>
    </MainCard>
  );
};

export default GenerateBillManual;
