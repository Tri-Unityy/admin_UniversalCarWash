import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Button,
    TextField,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Divider,
    IconButton,
    Chip,
    Stack,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const GenerateBillManual = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const booking = location.state || {};
    const [loading, setLoading] = useState(false);
    const currentDate = new Date().toISOString().split('T')[0];

    const calculateSubTotal = (vehicles) =>
        vehicles.reduce((sum, vehicle) => sum + vehicle.services.reduce((vSum, s) => vSum + (s.price || 0), 0), 0);

    const generateBookingID = () => {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

        const bookingID = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
        return bookingID;
    };

    const [bookingID] = useState(generateBookingID());

    const [formData, setFormData] = useState({
        id: bookingID,
        name: booking.name || '',
        phoneNumber: booking.phone || '',
        customerReference: booking.customerReference || '',
        bookingdate: currentDate,
        billReference: booking.billReference || '',
        timeSlot: booking.timeSlot || '',
        discount: 0,
        discountValue: 0,
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

    const isFormValid = () => {
        if (!formData.name.trim()) return false;
        if (formData.vehicles.length === 0) return false;

        for (const vehicle of formData.vehicles) {
            if (!vehicle.services || vehicle.services.length === 0) return false;

            for (const service of vehicle.services) {
                if (!service.name || service.price === undefined || service.price === '') {
                    return false;
                }
            }
        }

        return true;
    };

    useEffect(() => {
        const subTotal = calculateSubTotal(formData.vehicles);
        const discountValue = (formData.discount * subTotal) / 100;
        const total = subTotal - discountValue;
        setFormData((prev) => ({ ...prev, subTotal, total, discountValue }));
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
    setLoading(true);
    try {
      const db = getFirestore();
   
      if (!isFormValid()) {
        alert('Please fill in all required fields correctly.');
        setLoading(false);
        return;
      }

            const bookingDocRef = doc(db, 'universal-carwash-manual-bills', bookingID);
            const bookingDocSnapshot = await getDoc(bookingDocRef);

            if (!bookingDocSnapshot.exists()) {
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
                    customerReference: formData.customerReference,
                    subTotal: formData.subTotal,
                    total: formData.total,
                    billReference: formData.billReference,
                    timeSlot: formData.timeSlot,
                    discountValue: formData.discountValue
                };

                await setDoc(bookingDocRef, saveData);
                console.log('New document created in Firestore:', saveData);
            } else {
                console.log('Document already exists in Firestore.');
            }

            navigate('/generatedBill', { state: { ...formData, id: bookingID } });
        } catch (error) {
            console.error('Error handling booking ID:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainCard
            title={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1, sm: 2 },
                        flexWrap: 'wrap'
                    }}
                >
                    <ReceiptIcon color="primary" />
                    <Typography variant={{ xs: 'h5', sm: 'h4' }} component="h1" sx={{ flexGrow: 1 }}>
                        Generate Manual Bill
                    </Typography>
                    <Chip label={`ID: ${bookingID}`} color="primary" variant="outlined" size="small" />
                </Box>
            }
        >
            <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 1, sm: 2 } }}>
                {/* Customer Information Section */}
                <Card elevation={2} sx={{ mb: 4 }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <Typography variant={{ xs: 'h6', sm: 'h5' }} gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mb: 7 }}>
                            Customer Information
                        </Typography>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Customer Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Customer Reference"
                                    name="customerReference"
                                    value={formData.customerReference}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Bill Reference"
                                    name="billReference"
                                    value={formData.billReference}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Customer Address"
                                    name="customerAddress"
                                    value={formData.customerAddress}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Booking Details Section */}
                <Card elevation={2} sx={{ mb: 4 }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <Typography variant={{ xs: 'h6', sm: 'h5' }} gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mb: 3 }}>
                            Booking Details
                        </Typography>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Booking Date"
                                    name="bookingdate"
                                    type="date"
                                    value={formData.bookingdate}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Service Date"
                                    name="serviceDate"
                                    type="date"
                                    value={formData.serviceDate}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Payment Due Date"
                                    name="paymentDueDate"
                                    type="date"
                                    value={formData.paymentDueDate}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Time Slot"
                                    name="timeSlot"
                                    value={formData.timeSlot}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Discount Percentage"
                                    name="discount"
                                    type="number"
                                    placeholder="Enter discount percentage (e.g., 10)"
                                    value={formData.discount}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: '%'
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Vehicles & Services Section */}
                <Card elevation={2} sx={{ mb: 4 }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                mb: 3,
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: { xs: 2, sm: 0 }
                            }}
                        >
                            <Typography variant={{ xs: 'h6', sm: 'h5' }} sx={{ color: 'primary.main', fontWeight: 600 }}>
                                Vehicles & Services
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddVehicle}
                                size="medium"
                                sx={{
                                    borderRadius: 2,
                                    width: { xs: '100%', sm: 'auto' }
                                }}
                            >
                                Add Vehicle
                            </Button>
                        </Box>

                        <Stack spacing={3}>
                            {formData.vehicles.map((vehicle, vIndex) => (
                                <Card key={vIndex} variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 2,
                                                flexWrap: 'wrap',
                                                gap: { xs: 1, sm: 0 }
                                            }}
                                        >
                                            <Typography variant={{ xs: 'subtitle1', sm: 'h6' }} sx={{ fontWeight: 600 }}>
                                                Vehicle #{vIndex + 1}
                                            </Typography>
                                            {formData.vehicles.length > 1 && (
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleRemoveVehicle(vIndex)}
                                                    size="medium"
                                                    sx={{
                                                        bgcolor: 'error.light',
                                                        '&:hover': { bgcolor: 'error.main' },
                                                        minWidth: { xs: 40, sm: 'auto' }
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Box>

                                        <Grid container spacing={2} sx={{ mb: 3 }}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Vehicle Type"
                                                    value={vehicle.vehicleType}
                                                    onChange={(e) => handleVehicleChange(vIndex, 'vehicleType', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Vehicle Number"
                                                    value={vehicle.vehicleNumber}
                                                    onChange={(e) => handleVehicleChange(vIndex, 'vehicleNumber', e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 2 }} />

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: { xs: 'flex-start', sm: 'center' },
                                                mb: 2,
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                gap: { xs: 1, sm: 0 }
                                            }}
                                        >
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                Services
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<AddIcon />}
                                                onClick={() => handleAddServiceToVehicle(vIndex)}
                                                sx={{
                                                    borderRadius: 2,
                                                    width: { xs: '100%', sm: 'auto' }
                                                }}
                                            >
                                                Add Service
                                            </Button>
                                        </Box>

                                        <Stack spacing={2}>
                                            {vehicle.services.map((service, sIndex) => (
                                                <Box
                                                    key={sIndex}
                                                    sx={{
                                                        display: 'flex',
                                                        gap: { xs: 1, sm: 2 },
                                                        alignItems: { xs: 'stretch', sm: 'center' },
                                                        p: { xs: 1.5, sm: 2 },
                                                        bgcolor: 'white',
                                                        borderRadius: 1,
                                                        border: '1px solid',
                                                        borderColor: 'grey.300',
                                                        flexDirection: { xs: 'column', sm: 'row' }
                                                    }}
                                                >
                                                    <TextField
                                                        label="Service Name"
                                                        value={service.name}
                                                        onChange={(e) => handleVehicleServiceChange(vIndex, sIndex, 'name', e.target.value)}
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{ flex: { xs: 'auto', sm: 2 } }}
                                                        fullWidth
                                                    />
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            gap: 1,
                                                            alignItems: 'center',
                                                            flexDirection: { xs: 'row', sm: 'row' }
                                                        }}
                                                    >
                                                        <TextField
                                                            label="Price (CHF)"
                                                            type="number"
                                                            value={service.price || ''}
                                                            onChange={(e) =>
                                                                handleVehicleServiceChange(vIndex, sIndex, 'price', e.target.value)
                                                            }
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ flex: { xs: 1, sm: 'auto' }, minWidth: { xs: 'auto', sm: 120 } }}
                                                        />
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleRemoveServiceFromVehicle(vIndex, sIndex)}
                                                            size="small"
                                                            sx={{ flexShrink: 0 }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>

                {/* Bill Summary Section */}
                <Card elevation={2} sx={{ mb: 4 }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <Typography variant={{ xs: 'h6', sm: 'h5' }} gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mb: 3 }}>
                            Bill Summary
                        </Typography>
                        <Box sx={{ bgcolor: 'grey.50', p: { xs: 2, sm: 3 }, borderRadius: 2, mt: 1 }}>
                            <Grid container spacing={{ xs: 1, sm: 2 }}>
                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 } }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Subtotal
                                        </Typography>
                                        <Typography variant={{ xs: 'h5', sm: 'h4' }} sx={{ fontWeight: 600, color: 'primary.main' }}>
                                            {formData.subTotal.toFixed(2)} CHF
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 } }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Discount ({formData.discount}%)
                                        </Typography>
                                        <Typography variant={{ xs: 'h5', sm: 'h4' }} sx={{ fontWeight: 600, color: 'error.main' }}>
                                            -{formData.discountValue.toFixed(2)} CHF
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            p: { xs: 1.5, sm: 2 },
                                            bgcolor: 'primary.main',
                                            borderRadius: 2,
                                            mt: { xs: 1, sm: 0 }
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ color: 'white' }}>
                                            Total Amount
                                        </Typography>
                                        <Typography variant={{ xs: 'h4', sm: 'h3' }} sx={{ fontWeight: 700, color: 'white' }}>
                                            {formData.total.toFixed(2)} CHF
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>

                {/* Generate Bill Button */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 4,
                        px: { xs: 2, sm: 0 }
                    }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleGenerateBillManual}
                        sx={{ marginRight: 2 }}
                        disabled={formData.vehicles.some((vehicle) => vehicle.services.some((service) => !service.name || !service.price))}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Bill'}
                    </Button>
                </Box>
            </Box>
        </MainCard>
    );
};

export default GenerateBillManual;
