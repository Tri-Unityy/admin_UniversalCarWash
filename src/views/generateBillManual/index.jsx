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

  const calculateSubTotal = (vehicles) =>
    vehicles.reduce(
      (sum, vehicle) =>
        sum + vehicle.services.reduce((vSum, s) => vSum + (s.price || 0), 0),
      0
    );
  
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
    id: bookingID,
    name: booking.name || '',
    phoneNumber: booking.phone || '',
    bookingdate: currentDate,
    discount: 0,
    vehicles: booking.vehicles || [
      {
        vehicleType: booking.carmodel || '',
        vehicleNumber: booking.carnumber || '',
        services: booking.services?.map((s) => ({ name: s.name, price: s.price })) || []
      }
    ],
    paymentDueDate: currentDate,
    serviceDate: currentDate,
    customerAddress: booking.address || '',
    subTotal: booking.total || 0,
    total: booking.total || 0
  });
  

  useEffect(() => {
    const subTotal = calculateSubTotal(formData.vehicles);
    const total = subTotal - (formData.discount * subTotal) / 100;
    setFormData((prev) => ({ ...prev, subTotal, total }));
  }, [formData.vehicles, formData.discount]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddVehicle = () => {
    setFormData((prevData) => ({
      ...prevData,
      vehicles: [
        ...prevData.vehicles,
        {
          vehicleType: '',
          vehicleNumber: '',
          services: []
        }
      ]
    }));
  };

  const handleRemoveVehicle = (index) => {
    const updated = formData.vehicles.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, vehicles: updated }));
  };

  const handleVehicleChange = (index, field, value) => {
    const updated = [...formData.vehicles];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, vehicles: updated }));
  };

  const handleVehicleServiceChange = (vIndex, sIndex, field, value) => {
    const updatedVehicles = [...formData.vehicles];
    updatedVehicles[vIndex].services[sIndex][field] = field === 'price' ? parseFloat(value) || 0 : value;
    setFormData((prev) => ({ ...prev, vehicles: updatedVehicles }));
  };
  
  const handleAddServiceToVehicle = (vIndex) => {
    const updatedVehicles = [...formData.vehicles];
    updatedVehicles[vIndex].services.push({ name: '', price: 0 });
    setFormData((prev) => ({ ...prev, vehicles: updatedVehicles }));
  };
  
  const handleRemoveServiceFromVehicle = (vIndex, sIndex) => {
    const updatedVehicles = [...formData.vehicles];
    updatedVehicles[vIndex].services = updatedVehicles[vIndex].services.filter((_, i) => i !== sIndex);
    setFormData((prev) => ({ ...prev, vehicles: updatedVehicles }));
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
          discount: formData.discount,
          vehicles: formData.vehicles,
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
          <TextField fullWidth label="Booking Date" name="bookingdate" type="date" value={formData.bookingdate} onChange={handleInputChange} />
        </Box>
        <Box mb={2}>
          <TextField fullWidth label="Booking Time Slot" name="timeSlot" value={formData.timeSlot} onChange={handleInputChange} />
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
        {formData.vehicles.map((vehicle, vIndex) => (
        <Box key={vIndex} mb={4} p={2} border="1px solid #ccc" borderRadius={2}>
          <Typography variant="subtitle1" mb={1}>Vehicle #{vIndex + 1}</Typography>
          <TextField fullWidth label="Vehicle Type" value={vehicle.vehicleType} onChange={(e) => handleVehicleChange(vIndex, 'vehicleType', e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Vehicle Number" value={vehicle.vehicleNumber} onChange={(e) => handleVehicleChange(vIndex, 'vehicleNumber', e.target.value)} sx={{ mb: 2 }} />

          <Typography variant="body1" mb={1}>Services</Typography>
          {vehicle.services.map((service, sIndex) => (
            <Box key={sIndex} display="flex" gap={2} alignItems="center" mb={1}>
              <TextField label="Service Name" value={service.name} onChange={(e) => handleVehicleServiceChange(vIndex, sIndex, 'name', e.target.value)} />
              <TextField label="Price" type="number" value={service.price || ''} onChange={(e) => handleVehicleServiceChange(vIndex, sIndex, 'price', e.target.value)} />
              <Button variant="outlined" color="error" onClick={() => handleRemoveServiceFromVehicle(vIndex, sIndex)}>Remove</Button>
            </Box>
          ))}
          <Button variant="outlined" onClick={() => handleAddServiceToVehicle(vIndex)}>Add Service</Button>
          <Button variant="outlined" color="error" onClick={() => handleRemoveVehicle(vIndex)} sx={{ ml: 2 }}>Remove Vehicle</Button>
        </Box>
      ))}

      <Button variant="outlined" onClick={handleAddVehicle} sx={{ mb: 2 }}>
        Add Vehicle
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
            disabled={
              formData.vehicles.some(vehicle =>
                vehicle.services.some(service => !service.price)
              )
            }            
          >
            Generate Bill
          </Button>
        </Box>
      </Paper>
    </MainCard>
  );
};

export default GenerateBillManual;
